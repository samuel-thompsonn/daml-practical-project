
---

### Creating the Game Room
- Motivation: I want to separate out the visualizer from the rest of the
application, so that I can (1) abstract how things get visualized and (2)
easily place it anywhere I want in the website design.
- Approach 1: Pass the list of avatar locations to it via props, and let it 
figure out how to display that as avatars. This is potentially going to be
bad because it means re-rendering GameRoom every time a position changes,
which is ~60 times per second.
    - It looks like the re-rendering thing isn't really an issue for
    performance.
- So I have a React component that has access to p5, and I also have a
general template for p5-enabled objects: Pass in p5, and then have it draw 
itself on the canvas.
    - So, should I make the GameRoom Component a wrapper, and then make a
    GameRoom non-React object that draws (1) itself and (2) AvatarVis (via
    handing p5 over to the children)? Probably, but how do we add a new 
    Avatar, delete avatars, modify positions of avatars? This is kind of 
    unnecessarily stateful!
- How should I account for the client's model, in the case that I want
visualization to be somehow stateful?
    - Well, I want the actual React component to be minimally stateful. I 
    want its visual output to be a function of the model's state.
    - In fact, since the client's state is dictated by the server (for
    the p5 part of the project), the entire model is just a data structure,
    and I can store it as JSON.
    - So instead of having a client model with behavior, I should have a
    JS object that gets visualized by the React component. But the actual
    p5 interaction should be handled by non-React classes that interface
    with p5. So there shouldn't be an AvatarVis for each avatar--there should
    be a set of stateless AvatarVis classes which each have a function for
    how to draw an avatar.
        - Example: drawing a trail. You can store the location history as
        an array in the JSON that gets passed to GameRoom, and additionally
        store a parameter saying you want a TrailVis (a subclass of AvatarVis)
        to draw a particular avatar. Then the TrailVis uses the trail to draw
        both the trail and the avatar body.
            - Disadvantage: if I want to add a new type if visualizer for 
            avatar, I probably have to modify the Game data structure.
- How should I account for global parameters? Their default values should be
in a property file, and their actual values should be modifiable. What are the 
global parameters?
    - text size
    - avatar size for each avatar vis
    - room background color
- Should GameSketch be a property of GameRoom, or should it be instantiated
by GameRoom? 
    - Well, instantiation should never be taken lightly, but it also shouldn't
    be the job of the App which is accessing this p5 library thing. So perhaps
    instantiation should be handled within GameRoom and not higher up.