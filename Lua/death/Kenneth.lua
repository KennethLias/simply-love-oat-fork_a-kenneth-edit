local kenneth = {}

function kenneth:Setup()
    self(1):cmd("zoomto,SCREEN_WIDTH,SCREEN_HEIGHT;stretchto,0,0,SCREEN_WIDTH,SCREEN_HEIGHT;diffuse,1,0,0,0")
    self(2):cmd("zoomto,SCREEN_WIDTH,SCREEN_HEIGHT;xy,SCREEN_CENTER_X,SCREEN_CENTER_Y;diffusealpha,0;")
end

function kenneth:Dead()
    GAMESTATE:ApplyGameCommand('sound,feeesh')
    self(1):cmd("zoomto,SCREEN_WIDTH,SCREEN_HEIGHT;diffusealpha,.7;linear,.4;diffusealpha,0;")
    self(2):cmd("zoomto,SCREEN_WIDTH,SCREEN_HEIGHT;diffusealpha,1;linear,1;diffusealpha,0;")
end

return kenneth
