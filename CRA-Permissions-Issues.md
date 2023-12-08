# CRA Permissions Issues

This is all you should have to write in order to create a react app. If you use sudo, it can cause issues with permissions.

```bash
npx create-react-app my-app
cd my-app
npm start
```

If, after the `npx create-react-app my-app` command, you get an error.

Simplest solution is to un-install node and reinstall it. 

If that doesn't fix the problem, we will go through some other solutions now. 

There are several permissions errors that can occur when trying to use npm or create-react-app, we'll go through a few of them here.

## Why does this happen?

Creating a react app with sudo makes the project owned by the root user, which means that you will have to use sudo for every npm command you run. This is not ideal, so ideally we will not use sudo when creating a react app. 

## Cache folder permission error

![](assets/images/cache%20folder%20error.png)
The solution to this is inside the error, just run the command `sudo chown -R 501:20 "/Users/<yourusername>/.npm` and it should fix the issue.




## Well... I already used sudo, what do I do now?

If you have already used sudo, you can fix the issue by changing the owner of the project folder to your user.

```bash
sudo chown -R <yourusername> <projectfolder>
```

### How do i find my username?

You can find your username by running the command `whoami` in the terminal.

```bash
whoami
```

## I'm on windows, what do I do?

If you are on windows, you can right click on the project folder, go to properties, then security, then advanced, then change the owner to your user.