
function _extends(Derived, Base)
{
    // Create a new Object, give it Derived's contructor
    function BaseWithDerivedConstructor() {this.constructor = Derived;}
    // Give it Base function's through prototype
    BaseWithDerivedConstructor.prototype = Base.prototype;
    // Pass its instance function's to Derived's prototype
    Derived.prototype = new BaseWithDerivedConstructor();
}