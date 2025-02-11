// https://www.shadertoy.com/view/4djXzz
/*--------------------------------------------------------------------------------------
License CC0 - http://creativecommons.org/publicdomain/zero/1.0/
To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide. This software is distributed without any warranty.
----------------------------------------------------------------------------------------
^ This means do ANYTHING YOU WANT with this code. Because we are programmers, not lawyers.
-Otavio Good
*/

uniform float ptime;
uniform vec2 imageSize;
varying vec4 color;

// various noise functions
float Hash2d(vec2 uv)
{
    float f = uv.x + uv.y * 47.0;
    return fract(cos(f*3.333)*100003.9);
}
float Hash3d(vec3 uv)
{
    float f = uv.x + uv.y * 37.0 + uv.z * 521.0;
    return fract(cos(f*3.333)*100003.9);
}
float mixP(float f0, float f1, float a)
{
    return mix(f0, f1, a*a*(3.0-2.0*a));
}
const vec2 zeroOne = vec2(0.0, 1.0);
float noise2d(vec2 uv)
{
    vec2 fr = fract(uv.xy);
    vec2 fl = floor(uv.xy);
    float h00 = Hash2d(fl);
    float h10 = Hash2d(fl + zeroOne.yx);
    float h01 = Hash2d(fl + zeroOne);
    float h11 = Hash2d(fl + zeroOne.yy);
    return mixP(mixP(h00, h10, fr.x), mixP(h01, h11, fr.x), fr.y);
}
float noise(vec3 uv)
{
    vec3 fr = fract(uv.xyz);
    vec3 fl = floor(uv.xyz);
    float h000 = Hash3d(fl);
    float h100 = Hash3d(fl + zeroOne.yxx);
    float h010 = Hash3d(fl + zeroOne.xyx);
    float h110 = Hash3d(fl + zeroOne.yyx);
    float h001 = Hash3d(fl + zeroOne.xxy);
    float h101 = Hash3d(fl + zeroOne.yxy);
    float h011 = Hash3d(fl + zeroOne.xyy);
    float h111 = Hash3d(fl + zeroOne.yyy);
    return mixP(
        mixP(mixP(h000, h100, fr.x), mixP(h010, h110, fr.x), fr.y),
        mixP(mixP(h001, h101, fr.x), mixP(h011, h111, fr.x), fr.y)
        , fr.z);
}

float PI=3.14159265;

vec3 saturate(vec3 a)
{
	return clamp(a, 0.0, 1.0);
}
vec2 saturate(vec2 a)
{
	return clamp(a, 0.0, 1.0);
}
float saturate(float a)
{
	return clamp(a, 0.0, 1.0);
}

float Density(vec3 p)
{
    //float ws = 0.06125*0.125;
    //vec3 warp = vec3(noise(p*ws), noise(p*ws + 111.11), noise(p*ws + 7111.11));
    float final = noise(p*0.06125);// + sin(iptime)*0.5-1.95 + warp.x*4.0;
    float other = noise(p*0.06125 + 1234.567);
    other -= 0.5;
    final -= 0.5;
    final = 0.1/(abs(final*final*other));
    final += 0.5;
    return final*0.0001;
}

void main()
{
	// ---------------- First, set up the camera rays for ray marching ----------------
	vec2 uv = gl_FragCoord.xy/imageSize.xy * 2.0 - 1.0;// - 0.5;
  uv /= 80.0;

	// Camera up vector.
	vec3 camUp=vec3(0,1,0); // vuv

	// Camera lookat.
	vec3 camLookat=vec3(0,0.0,0);	// vrp

	//float mx=iMouse.x/imageSize.x*PI*2.0 + ptime * 0.01;
  float mx=ptime * 0.01;
	//float my=-iMouse.y/imageSize.y*10.0 + sin(ptime * 0.03)*0.2+0.2;//*PI/2.01;
  float my=sin(ptime * 0.03)*0.2+0.2;//*PI/2.01;
	vec3 camPos=vec3(cos(my)*cos(mx),sin(my),cos(my)*sin(mx))*(200.2); 	// prp

	// Camera setup.
	vec3 camVec=normalize(camLookat - camPos);//vpn
	vec3 sideNorm=normalize(cross(camUp, camVec));	// u
	vec3 upNorm=cross(camVec, sideNorm);//v
	vec3 worldFacing=(camPos + camVec);//vcv
	vec3 worldPix = worldFacing + uv.x * sideNorm * (imageSize.x/imageSize.y) + uv.y * upNorm;//scrCoord
	vec3 relVec = normalize(worldPix - camPos);//scp

	// --------------------------------------------------------------------------------
	float t = 0.0;
	float inc = 0.02;
	float maxDepth = 30.0;
	vec3 pos = vec3(0,0,0);
    float density = 0.0;
	// ray marching ptime
    for (int i = 0; i < 15; i++)	// This is the count of how many ptimes the ray actually marches.
    {
        if ((t > maxDepth)) break;
        pos = camPos + relVec * t;
        float temp = Density(pos);
        //temp *= saturate(t-1.0);

        inc = 1.9 + temp*0.05;	// add temp because this makes it look extra crazy!
        density += temp * inc;
        t += inc;
    }

	// --------------------------------------------------------------------------------
	// Now that we have done our ray marching, let's put some color on this.
	vec3 finalColor = (color.rgb + vec3(0.0, 0.01, 0.0)) * density*0.2;

    finalColor *= (float(mod(gl_FragCoord.y, 2)) * 0.75 + 0.25);

	// output the final color with sqrt for "gamma correction"
	gl_FragColor = vec4(sqrt(clamp(finalColor, 0.0, 1.0)),color.a);
}
