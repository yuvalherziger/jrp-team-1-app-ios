# JRP Team 1 (Consumption) Study App

This tutorial will describe how you can run and test the app on your own computer (Mac only, sorry :smiley:) 

## Table of Contents:

* **(1)** [Prerequisites](https://github.com/yuvalherziger/jrp-team-1-app/blob/master/README.md#1-prerequisites)
  * **(1.1)** [Installing Xcode](https://github.com/yuvalherziger/jrp-team-1-app/blob/master/README.md#11-installing-xcode)
  * **(1.2)** [Installing homebrew](https://github.com/yuvalherziger/jrp-team-1-app/blob/master/README.md#12-installing-homebrew)
  * **(1.3)** [Installing npm](https://github.com/yuvalherziger/jrp-team-1-app/blob/master/README.md#13-installing-npm)
  * **(1.4)** [Installing Apache Cordova](https://github.com/yuvalherziger/jrp-team-1-app/blob/master/README.md#14-installing-apache-cordova)
  * **(1.5)** [Installing git](https://github.com/yuvalherziger/jrp-team-1-app/blob/master/README.md#15-installing-git)
* **(2)** [Cloning the app code](https://github.com/yuvalherziger/jrp-team-1-app/blob/master/README.md#2-cloning-the-app-code) 
* **(3)** [Emulating the app on iOS](https://github.com/yuvalherziger/jrp-team-1-app/blob/master/README.md#3-emulating-the-app-on-ios) 
* **(4)** [Emulating the app on Android](https://github.com/yuvalherziger/jrp-team-1-app/blob/master/README.md#4-emulating-the-app-on-android)

## (1) Prerequisites

In order to emulate the app, you will need to install all of the following on your Mac:

1. **Xcode** - Apple's integrated development environment for Mac
2. **homebrew** - an excellent package manager for Mac OS, will be used to install **npm**
3. **npm** - node package manager - will be used for the installation of other components
4. **Apache Cordova** - a platform with a command line tool for building HTML/JS/CSS apps for mobile devices
5. **git** - a source control system that allows you to collaborate on this project

    ### (1.1) Installing Xcode
    
    Keep in mind that Xcode takes ~5GB of your hard drive's space.
    Go to Apple's app store and install Xcode ([use this link][app-store-xcode]).     
    
    After the installation is completed, **open the Xcode** app to simply accept the license agreement.
    
    After accepting the license agreement, there's only one step you need to take:
    
    1. Open your terminal (CMD + T and type `terminal`)
    2. Paste the following command and hit ENTER:
    
    ```bash
    sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
    ```
    
    Type in your password when prompted to, and that's it.

    ### (1.2) Installing homebrew
    
    Open your terminal (CMD + T and type `terminal`).
    
    First let's check if you already have _homebrew_ installed on your Mac:
    
    Within the terminal, paste the following command:
    ```bash
    brew ls -l
    ```
    
    If the output is something along the lines of **`command not found: brew`**, then you should carry on as mentioned below.
    
    Within the terminal, paste the following command and follow the instructions. 
    
    _You might be prompted to insert your password (it's the same password you use to log into your Mac)._
    
    ```bash
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    ```
    
    Hit enter and follow the instructions.

    ### (1.3) Installing npm 
    
    Open your terminal (CMD + T and type `terminal` + ENTER), then just type the following command and press ENTER. 
    ```bash
    brew update
    ```
    
    Then run the following command and press ENTER.
    
    _You might be prompted to insert your password (it's the same password you use to log into your Mac)._
    
    ```bash
    brew install node
    ```

    ### (1.4) Installing Apache Cordova
    
    Open your terminal (CMD + T and type `terminal` + ENTER), then just type the following command and press ENTER:
    
    _You will be prompted to insert your password (it's the same password you use to log into your Mac)._
    
    ```bash
    sudo npm install -g cordova
    ```

    ### (1.5) Installing git
    
    Open your terminal (CMD + T and type `terminal` + ENTER), then just type the following command and press ENTER:
    
    ```bash
    brew install git
    ```

## (2) Cloning the app code 

Now that you have installed all of the required package managers and the required software, you can clone the app.
 
Open your terminal and browse to a folder where you would like to download the app. 
For instance, if you would like to create a folder for projects workspace named `workspace`, use the `mkdir` command to create a folder and `cd` command to change the folder you are currently in: 

```bash
# here we are creating a new folder under the home folder:

mkdir ~/workspace

# now we are switching the working directory to it:
cd ~/workspace

```

Next, let's use the newly installed _git_ tool to clone the app from this repository:

```bash
git clone https://github.com/yuvalherziger/jrp-team-1-app.git
```

After the numbers finish crunching, you will have a new folder named _**jrp-team-1-app**_ in place. Let's go ahead change the working directory to the root app directory:

```bash
cd jrp-team-1-app
```

## (3) Emulating the app on iOS

Now for the fun part :tada:

While in the _**jrp-team-1-app**_ working directory, type the following command:

```bash
cordova platforms add ios
cordova build ios
```

This command just built an ios app that's ready to be emulated. Lastly, let's run the app on the emulator:

```bash
cordova emulate ios
```

## (4) Emulating the app on Android

Since emulating an Android device...

1. requires a long setup that entails the installation of Android Studio and an AVD (**A**ndroid **V**irtual **D**evice);
2. tends to be slow; 

...I would strongly advise you to enable USB debugging on an Android device (provided that you posses one) and test the app on it. 
Under [this link][usb-debuggin-android] you can discover how to enable USB debugging on your Android device.

After enabling USB debugging on your Android device and connecting it to your computer with a USB cable, you can simply run the following command to build the app:

```bash
cordova platforms add android
cordova build android
```

Afterwards you should be able to run the app on your device by running the following command:
```bash
cordova run android
```

Cordova should automatically detect your connected device and target the app to it.

 
It just might be that you don't have an Android device, and in this case you can visit [this link][android-emulator-mac] to find out how to create an Android Emulator.


Do mind the fact that you already have `git` and `homebrew` installed on your Mac from the previous steps of this guide.

If you have gone down the path of installing an Android emulator, the command to emulate it is the following one:

```bash
cordova emulate android
```

[usb-debuggin-android]: https://www.kingoapp.com/root-tutorials/how-to-enable-usb-debugging-mode-on-android.htm
[app-store-xcode]: https://itunes.apple.com/us/app/xcode/id497799835?mt=12
[android-emulator-mac]: :https://facebook.github.io/react-native/releases/0.23/docs/android-setup.html
