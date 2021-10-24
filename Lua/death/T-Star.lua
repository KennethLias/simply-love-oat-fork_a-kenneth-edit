local tstar = {}

function tstar:Setup()
    self(1):cmd("zoomto,SCREEN_WIDTH,SCREEN_HEIGHT;stretchto,0,0,SCREEN_WIDTH,SCREEN_HEIGHT;diffusealpha,0")
end

function tstar:Dead()
    GAMESTATE:ApplyGameCommand('sound,thudextra')
    self(1):cmd("x,SCREEN_CENTER_X;y,SCREEN_CENTER_Y;zoom,0.5;diffusealpha,1;linear,2;diffusealpha,0;")
end

return tstar
