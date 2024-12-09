## Using the JavaScript Debugger

The JavaScript debugger is a powerful tool that allows you to pause the execution of your code and inspect the values of variables at that point in time. This can be incredibly useful for debugging complex code or tracking down hard-to-find bugs.

### Adding a 'Breakpoint'

A breakpoint is a point in your code where the debugger will pause execution. You can type `debugger;` in your code to add a breakpoint. For example:

```javascript
function myFunction() {
    let x = 5;
    debugger;
    console.log(x);
}
```

When the code reaches the `debugger;` statement, it will pause execution and allow you to inspect the values of variables.

So the steps are:

1. Add a breakpoint using the `debugger` keyword.
2. Run your code in the browser (With the developer tools open!).
3. Once the code reaches the breakpoint, the debugger will pause execution.

### Using the Debugger

![](../assets/videos/debugger.mp4)

WIP