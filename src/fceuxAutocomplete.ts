export const api = {
    emu: {
        type: "module",
        children: {
            poweron: {
                type: "function",
                desc: "Executes a power cycle."
            },
            softreset: {
                type: "function",
                desc: "Executes a (soft) reset."
            },
            speedmode: {
                type: "function",
                desc: "Set the emulator to given speed. The mode argument can be one of these:\n- \"normal\"\n- \"nothrottle\" (same as turbo on fceux)\n- \"turbo\"\n- \"maximum\"",
                parameters: {
                    mode: {
                        type: "string",
                        desc: "One of: normal, nothrottle, turbo, maximum."
                    }
                }
            },
            frameadvance: {
                type: "function",
                desc: "Advance the emulator by one frame. It's like pressing the frame advance button once.\n\nMost scripts use this function in their main game loop to advance frames. Note that you can also register functions by various methods that run \"dead\", returning control to the emulator and letting the emulator advance the frame.  For most people, using frame advance in an endless while loop is easier to comprehend so I suggest  starting with that.  This makes more sense when creating bots. Once you move to creating auxillary libraries, try the register() methods."
            },
            pause: {
                type: "function",
                desc: "Pauses the emulator."
            },
            unpause: {
                type: "function",
                desc: "Unpauses the emulator."
            },
            exec_count: {
                type: "function",
                desc: "Calls given function, restricting its working time to given number of lua cycles. Using this method you can ensure that some heavy operation (like Lua bot) won't freeze FCEUX.",
                parameters: {
                    count: {
                        type: "integer"
                    },
                    func: {
                        type: "function"
                    }
                }
            },
            exec_time: {
                type: "function",
                desc: "Windows-only. Calls given function, restricting its working time to given number of milliseconds (approximate). Using this method you can ensure that some heavy operation (like Lua bot) won't freeze FCEUX.",
                parameters: {
                    time: {
                        type: "integer"
                    },
                    func: {
                        type: "function"
                    }
                }
            },
            setrenderplanes: {
                type: "function",
                desc: "Toggles the drawing of the sprites and background planes. Set to false or nil to disable a pane, anything else will draw them.",
                parameters: {
                    sprites: {
                        type: "boolean"
                    },
                    background: {
                        type: "boolean"
                    }
                }
            },
            message: {
                type: "function",
                desc: "Displays given message on screen in the standard messages position. Use gui.text() when you need to position text.",
                parameters: {
                    message: {
                        type: "string"
                    }
                }
            },
            framecount: {
                type: "function",
                returns: "integer",
                desc: "Returns the framecount value. The frame counter runs without a movie running so this always returns a value."
            },
            lagcount: {
                type: "function",
                returns: "integer",
                desc: "Returns the number of lag frames encountered. Lag frames are frames where the game did not poll for input because it missed the vblank. This happens when it has to compute too much within the frame boundary. This returns the number indicated on the lag counter."
            },
            lagged: {
                type: "function",
                returns: "boolean",
                desc: "Returns true if currently in a lagframe, false otherwise."
            },
            setlagflag: {
                type: "function",
                returns: "boolean",
                desc: "Sets current value of lag flag.\nSome games poll input even in lag frames, so standard way of detecting lag (used by FCEUX and other emulators) does not work for those games, and you have to determine lag frames manually.\nFirst, find RAM addresses that help you distinguish between lag and non-lag frames (e.g. an in-game frame counter that only increments in non-lag frames). Then register memory hooks that will change lag flag when needed.",
                parameters: {
                    value: {
                        type: "boolean"
                    }
                }
            },
            emulating: {
                type: "function",
                returns: "boolean",
                desc: "Returns true if emulation has started, or false otherwise. Certain operations such as using savestates are invalid to attempt before emulation has started. You probably won't need to use this function unless you want to make your script extra-robust to being started too early."
            },
            paused: {
                type: "function",
                returns: "boolean",
                desc: "Returns true if emulator is paused, false otherwise."
            },
            readonly: {
                type: "function",
                returns: "boolean",
                desc: "Returns whether the emulator is in read-only state.\nWhile this variable only applies to movies, it is stored as a global variable and can be modified even without a movie loaded.  Hence, it is in the emu library rather than the movie library."
            },
            setreadonly: {
                type: "function",
                desc: "Sets the read-only status to read-only if argument is true and read+write if false.\nNote: This might result in an error if the medium of the movie file is not writeable (such as in an archive file).\n\nWhile this variable only applies to movies, it is stored as a global variable and can be modified even without a movie loaded.  Hence, it is in the emu library rather than the movie library.",
                parameters: {
                    state: {
                        type: "boolean"
                    }
                }
            },
            getdir: {
                type: "function",
                desc: "Returns the path of fceux.exe as a string."
            },
            loadrom: {
                type: "function",
                desc: "Loads the ROM from the directory relative to the lua script or from the absolute path. Hence, the filename parameter can be absolute or relative path.\n\nIf the ROM can't e loaded, loads the most recent one.",
                parameters: {
                    filename: {
                        type: "boolean"
                    }
                }
            },
            registerbefore: {
                type: "function",
                desc: "Registers a callback function to run immediately before each frame gets emulated. This runs after the next frame's input is known but before it's used, so this is your only chance to set the next frame's input using the next frame's would-be input. For example, if you want to make a script that filters or modifies ongoing user input, such as making the game think \"left\" is pressed whenever you press \"right\", you can do it easily with this.\n\nNote that this is not quite the same as code that's placed before a call to emu.frameadvance. This callback runs a little later than that. Also, you cannot safely assume that this will only be called once per frame. Depending on the emulator's options, every frame may be simulated multiple times and your callback will be called once per simulation. If for some reason you need to use this callback to keep track of a stateful linear progression of things across frames then you may need to key your calculations to the results of emu.framecount.\n\nLike other callback-registering functions provided by FCEUX, there is only one registered callback at a time per registering function per script. If you register two callbacks, the second one will replace the first, and the call to emu.registerbefore will return the old callback. You may register nil instead of a function to clear a previously-registered callback. If a script returns while it still has registered callbacks, FCEUX will keep it alive to call those callbacks when appropriate, until either the script is stopped by the user or all of the callbacks are de-registered.",
                parameters: {
                    func: {
                        type: "function"
                    }
                }
            },
            registerafter: {
                type: "function",
                desc: "Registers a callback function to run immediately after each frame gets emulated. It runs at a similar time as (and slightly before) gui.register callbacks, except unlike with gui.register it doesn't also get called again whenever the screen gets redrawn. Similar caveats as those mentioned in emu.registerbefore apply.",
                parameters: {
                    func: {
                        type: "function"
                    }
                }
            },
            registerexit: {
                type: "function",
                desc: "Registers a callback function that runs when the script stops. Whether the script stops on its own or the user tells it to stop, or even if the script crashes or the user tries to close the emulator, FCEUX will try to run whatever Lua code you put in here first. So if you want to make sure some code runs that cleans up some external resources or saves your progress to a file or just says some last words, you could put it here. (Of course, a forceful termination of the application or a crash from inside the registered exit function will still prevent the code from running.)\n\nSuppose you write a script that registers an exit function and then enters an infinite loop. If the user clicks \"Stop\" your script will be forcefully stopped, but then it will start running its exit function. If your exit function enters an infinite loop too, then the user will have to click \"Stop\" a second time to really stop your script. That would be annoying. So try to avoid doing too much inside the exit function.\n\nNote that restarting a script counts as stopping it and then starting it again, so doing so (either by clicking \"Restart\" or by editing the script while it is running) will trigger the callback. Note also that returning from a script generally does NOT count as stopping (because your script is still running or waiting to run its callback functions and thus does not stop... see here for more information), even if the exit callback is the only one you have registered.",
                parameters: {
                    func: {
                        type: "function"
                    }
                }
            },
            addgamegenie: {
                type: "function",
                desc: "Adds a Game Genie code to the Cheats menu. Returns false and an error message if the code can't be decoded. Returns false if the code couldn't be added. Returns true if the code already existed, or if it was added.\n\nUsage: emu.addgamegenie(\"NUTANT\")\n\nNote that the Cheats Dialog Box won't show the code unless you close and reopen it.",
                returns: "boolean",
                parameters: {
                    str: {
                        type: "string"
                    }
                }
            },
            delgamegenie: {
                type: "function",
                desc: "Removes a Game Genie code from the Cheats menu. Returns false and an error message if the code can't be decoded. Returns false if the code couldn't be deleted. Returns true if the code didn't exist, or if it was deleted.\n\nUsage: emu.delgamegenie(\"NUTANT\")\n\nNote that the Cheats Dialog Box won't show the code unless you close and reopen it.",
                returns: "boolean",
                parameters: {
                    str: {
                        type: "string"
                    }
                }
            },
            print: {
                type: "function",
                desc: "Puts a message into the Output Console area of the Lua Script control window. Useful for displaying usage instructions to the user when a script gets run.",
                parameters: {
                    str: {
                        type: "string"
                    }
                }
            },
            getscreenpixel: {
                type: "function",
                desc: "Returns the separate RGB components of the given screen pixel, and the palette. Can be 0-255 by 0-239, but NTSC only displays 0-255 x 8-231 of it. If getemuscreen is false, this gets background colors from either the screen pixel or the LUA pixels set, but LUA data may not match the information used to put the data to the screen. If getemuscreen is true, this gets background colors from anything behind an LUA screen element.\n\nUsage is local r,g,b,palette = emu.getscreenpixel(5, 5, false) to retrieve the current red/green/blue colors and palette value of the pixel at 5x5.\n\nPalette value can be 0-63, or 254 if there was an error.\n\nYou can avoid getting LUA data by putting the data into a function, and feeding the function name to emu.registerbefore.",
                parameters: {
                    x: {
                        type: "integer"
                    },
                    y: {
                        type: "int"
                    },
                    getemuscreen: {
                        type: "bool"
                    }
                }
            }
        }
    },
    rom: {
        type: "module",
        children: {
            readbyte: {
                type: "function",
                desc: "Get an unsigned byte from the actual ROM file at the given address.\n\nThis includes the header! It's the same as opening the file in a hex-editor.",
                parameters: {
                    address: {
                        type: "int"
                    }
                }
            },
            readbyteunsigned: {
                type: "function",
                desc: "Get an unsigned byte from the actual ROM file at the given address.\n\nThis includes the header! It's the same as opening the file in a hex-editor.",
                parameters: {
                    address: {
                        type: "int"
                    }
                }
            },
            readbytesigned: {
                type: "function",
                desc: "Get a signed byte from the actual ROM file at the given address. Returns a byte that is signed.\n\nThis includes the header! It's the same as opening the file in a hex-editor.",
                parameters: {
                    address: {
                        type: "int"
                    }
                }
            },
            writebyte: {
                type: "function",
                desc: "Write the value to the ROM at the given address. The value is modded with 256 before writing (so writing 257 will actually write 1). Negative values allowed.\n\nEditing the header is not available."
            }
        },
    },
    memory: {
        type: "module",
        children: {
            readbyte: {
                parameters: {
                    address: {
                        type: "int"
                    }
                },
                desc: "Get an unsigned byte from the RAM at the given address. Returns a byte regardless of emulator. The byte will always be positive."
            },
            readbyteunsigned: {
                parameters: {
                    address: {
                        type: "int"
                    }
                },
                desc: "Get an unsigned byte from the RAM at the given address. Returns a byte regardless of emulator. The byte will always be positive."
            },
            readbyterange: {
                parameters: {
                    address: {
                        type: "int"
                    },
                    length: {
                        type: "int"
                    }
                },
                desc: "Get a length bytes starting at the given address and return it as a string. Convert to table to access the individual bytes."
            },
            readbytesigned: {
                parameters: {
                    address: {
                        type: "int"
                    }
                },
                desc: "Get a signed byte from the RAM at the given address. Returns a byte regardless of emulator. The most significant bit will serve as the sign."
            },
            readword: {
                parameters: {
                    addressLow: {
                        type: "int"
                    },
                    addressHigh: {
                        type: "int"
                    }
                },
                desc: "Get an unsigned word from the RAM at the given address. Returns a 16-bit value regardless of emulator. The value will always be positive.\n\nIf you only provide a single parameter (addressLow), the function treats it as address of little-endian word. if you provide two parameters, the function reads the low byte from addressLow and the high byte from addressHigh, so you can use it in games which like to store their variables in separate form (a lot of NES games do)."
            },
            readwordunsigned: {
                parameters: {
                    addressLow: {
                        type: "int"
                    },
                    addressHigh: {
                        type: "int"
                    }
                },
                desc: "Get an unsigned word from the RAM at the given address. Returns a 16-bit value regardless of emulator. The value will always be positive.\n\nIf you only provide a single parameter (addressLow), the function treats it as address of little-endian word. if you provide two parameters, the function reads the low byte from addressLow and the high byte from addressHigh, so you can use it in games which like to store their variables in separate form (a lot of NES games do)."
            },
            readwordsigned: {
                parameters: {
                    addressLow: {
                        type: "int"
                    },
                    addressHigh: {
                        type: "int"
                    }
                },
                desc: "The same as above, except the returned value is signed, i.e. its most significant bit will serve as the sign."
            },
            writebyte: {
                parameters: {
                    address: {
                        type: "int"
                    },
                    value: {
                        type: "int"
                    }
                },
                desc: "Write the value to the RAM at the given address. The value is modded with 256 before writing (so writing 257 will actually write 1). Negative values allowed."
            },
            getregister: {
                returns: "int",
                parameters: {
                    cpuregistername: {
                        type: "string"
                    }
                },
                desc: "Returns the current value of the given hardware register.\n\nFor example, memory.getregister('pc') will return the main CPU's current Program Counter.\n\nValid registers are: 'a', 'x', 'y', 's', 'p', and 'pc'."
            },
            setregister: {
                parameters: {
                    cpuregistername: {
                        type: "string"
                    },
                    value: {
                        type: "int"
                    }
                },
                desc: "Sets the current value of the given hardware register.\n\nFor example, memory.setregister('pc',0x200) will change the main CPU's current Program Counter to 0x200.\n\nValid registers are: 'a', 'x', 'y', 's', 'p', and 'pc'.\n\nYou had better know exactly what you're doing or you're probably just going to crash the game if you try to use this function. That applies to the other memory.write functions as well, but to a lesser extent."
            },
            register: {
                parameters: {
                    address: {
                        type: "int"
                    },
                    size: {
                        type: "int"
                    },
                    func: {
                        type: "function"
                    }
                },
                desc: "Registers a function to be called immediately whenever the given memory address range is written to.\n\naddress is the address in CPU address space (0x0000 - 0xFFFF).\n\nsize is the number of bytes to 'watch'. For example, if size is 100 and address is 0x0200, then you will register the function across all 100 bytes from 0x0200 to 0x0263. A write to any of those bytes will trigger the function. Having callbacks on a large range of memory addresses can be expensive, so try to use the smallest range that's necessary for whatever it is you're trying to do. If you don't specify any size then it defaults to 1.\n\nThe callback function will receive two arguments, (address, size) indicating what write operation triggered the callback. If you don't care about that extra information then you can ignore it and define your callback function to not take any arguments. The value that was written is NOT passed into the callback function, but you can easily use any of the memory.read functions to retrieve it.\n\nYou may use a memory.write function from inside the callback to change the value that just got written. However, keep in mind that doing so will trigger your callback again, so you must have a 'base case' such as checking to make sure that the value is not already what you want it to be before writing it. Another, more drastic option is to de-register the current callback before performing the write.\n\nIf func is nil that means to de-register any memory write callbacks that the current script has already registered on the given range of bytes."
            },
            registerwrite: {
                parameters: {
                    address: {
                        type: "int"
                    },
                    size: {
                        type: "int"
                    },
                    func: {
                        type: "function"
                    }
                },
                desc: "Registers a function to be called immediately whenever the given memory address range is written to.\n\naddress is the address in CPU address space (0x0000 - 0xFFFF).\n\nsize is the number of bytes to 'watch'. For example, if size is 100 and address is 0x0200, then you will register the function across all 100 bytes from 0x0200 to 0x0263. A write to any of those bytes will trigger the function. Having callbacks on a large range of memory addresses can be expensive, so try to use the smallest range that's necessary for whatever it is you're trying to do. If you don't specify any size then it defaults to 1.\n\nThe callback function will receive two arguments, (address, size) indicating what write operation triggered the callback. If you don't care about that extra information then you can ignore it and define your callback function to not take any arguments. The value that was written is NOT passed into the callback function, but you can easily use any of the memory.read functions to retrieve it.\n\nYou may use a memory.write function from inside the callback to change the value that just got written. However, keep in mind that doing so will trigger your callback again, so you must have a 'base case' such as checking to make sure that the value is not already what you want it to be before writing it. Another, more drastic option is to de-register the current callback before performing the write.\n\nIf func is nil that means to de-register any memory write callbacks that the current script has already registered on the given range of bytes."
            },
            registerexec: {
                parameters: {
                    address: {
                        type: "int"
                    },
                    size: {
                        type: "int"
                    },
                    func: {
                        type: "function"
                    }
                },
                desc: "Registers a function to be called immediately whenever the emulated system runs code located in the given memory address range.\n\nSince 'address' is the address in CPU address space (0x0000 - 0xFFFF), this doesn't take ROM banking into account, so the callback will be called for any bank, and in some cases you'll have to check current bank in your callback function.\n\nThe information about memory.register applies to this function as well."
            },
            registerrun: {
                parameters: {
                    address: {
                        type: "int"
                    },
                    size: {
                        type: "int"
                    },
                    func: {
                        type: "function"
                    }
                },
                desc: "Registers a function to be called immediately whenever the emulated system runs code located in the given memory address range.\n\nSince 'address' is the address in CPU address space (0x0000 - 0xFFFF), this doesn't take ROM banking into account, so the callback will be called for any bank, and in some cases you'll have to check current bank in your callback function.\n\nThe information about memory.register applies to this function as well."
            },
            registerexecute: {
                parameters: {
                    address: {
                        type: "int"
                    },
                    size: {
                        type: "int"
                    },
                    func: {
                        type: "function"
                    }
                },
                desc: "Registers a function to be called immediately whenever the emulated system runs code located in the given memory address range.\n\nSince 'address' is the address in CPU address space (0x0000 - 0xFFFF), this doesn't take ROM banking into account, so the callback will be called for any bank, and in some cases you'll have to check current bank in your callback function.\n\nThe information about memory.register applies to this function as well."
            }
        }
    },
    debugger: {
        type: "module",
        children: {
            hitbreakpoint: {
                type: "function",
                desc: "Simulates a breakpoint hit, pauses emulation and brings up the Debugger window. Use this function in your handlers of custom breakpoints."
            },
            getcyclescount: {
                type: "function",
                returns: "int",
                desc: "Returns an integer value representing the number of CPU cycles elapsed since the poweron or since the last reset of the cycles counter."
            },
            getinstructionscount: {
                type: "function",
                returns: "int",
                desc: "Returns an integer value representing the number of CPU instructions executed since the poweron or since the last reset of the instructions counter."
            },
            resetcyclescount: {
                type: "function",
                desc: "Resets the cycles counter."
            },
            resetinstructionscount: {
                type: "function",
                desc: "Resets the instructions counter."
            }
        },
    },
    joypad: {
        type: "module",
        children: {
            get: {
                parameters: {
                    player: {
                        type: "int"
                    }
                },
                type: "function",
                returns: "table",
                desc: "Returns a table of every game button, where each entry is true if that button is currently held (as of the last time the emulation checked), or false if it is not held. This takes keyboard inputs, not Lua. The table keys look like this (case sensitive):\n\nup, down, left, right, A, B, start, select\n\nWhere a Lua truthvalue true means that the button is set, false means the button is unset. Note that only 'false' and 'nil' are considered a false value by Lua.  Anything else is true, even the number 0.\n\njoypad.read left in for backwards compatibility with older versions of FCEU/FCEUX."
            },
            read: {
                parameters: {
                    player: {
                        type: "int"
                    }
                },
                type: "function",
                returns: "table",
                desc: "Returns a table of every game button, where each entry is true if that button is currently held (as of the last time the emulation checked), or false if it is not held. This takes keyboard inputs, not Lua. The table keys look like this (case sensitive):\n\nup, down, left, right, A, B, start, select\n\nWhere a Lua truthvalue true means that the button is set, false means the button is unset. Note that only 'false' and 'nil' are considered a false value by Lua.  Anything else is true, even the number 0.\n\njoypad.read left in for backwards compatibility with older versions of FCEU/FCEUX."
            },
            getimmediate: {
                parameters: {
                    player: {
                        type: "int"
                    }
                },
                type: "function",
                returns: "table",
                desc: "Returns a table of every game button, where each entry is true if that button is held at the moment of calling the function, or false if it is not held. This function polls keyboard input immediately, allowing Lua to interact with user even when emulator is paused.\n\nAs of FCEUX 2.2.0, the function only works in Windows. In Linux this function will return nil."
            },
            readimmediate: {
                parameters: {
                    player: {
                        type: "int"
                    }
                },
                type: "function",
                returns: "table",
                desc: "Returns a table of every game button, where each entry is true if that button is held at the moment of calling the function, or false if it is not held. This function polls keyboard input immediately, allowing Lua to interact with user even when emulator is paused.\n\nAs of FCEUX 2.2.0, the function only works in Windows. In Linux this function will return nil."
            },
            getdown: {
                parameters: {
                    player: {
                        type: "int"
                    }
                },
                type: "function",
                returns: "table",
                desc: "Returns a table of only the game buttons that are currently held. Each entry is true if that button is currently held (as of the last time the emulation checked), or nil if it is not held."
            },
            readdown: {
                parameters: {
                    player: {
                        type: "int"
                    }
                },
                type: "function",
                returns: "table",
                desc: "Returns a table of only the game buttons that are currently held. Each entry is true if that button is currently held (as of the last time the emulation checked), or nil if it is not held."
            },
            getup: {
                parameters: {
                    player: {
                        type: "int"
                    }
                },
                type: "function",
                returns: "table",
                desc: "Returns a table of only the game buttons that are not currently held. Each entry is nil if that button is currently held (as of the last time the emulation checked), or false if it is not held."
            },
            readup: {
                parameters: {
                    player: {
                        type: "int"
                    }
                },
                type: "function",
                returns: "table",
                desc: "Returns a table of only the game buttons that are not currently held. Each entry is nil if that button is currently held (as of the last time the emulation checked), or false if it is not held."
            },
            set: {
                parameters: {
                    player: {
                        type: "int"
                    },
                    input: {
                        type: "table"
                    }
                },
                type: "function",
                desc: "Set the inputs for the given player. Table keys look like this (case sensitive):\n\nup, down, left, right, A, B, start, select\n\nThere are 4 possible values: true, false, nil, and 'invert'.\ntrue    - Forces the button on\nfalse   - Forces the button off\nnil     - User's button press goes through unchanged\n'invert'- Reverses the user's button press\n\nAny string works in place of 'invert'.  It is suggested as a convention to use 'invert' for readability, but strings like 'inv', 'Weird switchy mechanism', '', or 'true or false' works as well as 'invert'.\n\nnil and 'invert' exists so the script can control individual buttons of the controller without entirely blocking the user from having any control. Perhaps there is a process which can be automated by the script, like an optimal firing pattern, but the user still needs some manual control, such as moving the character around.\n\njoypad.write left in for backwards compatibility with older versions of FCEU/FCEUX."
            },
            write: {
                parameters: {
                    player: {
                        type: "int"
                    },
                    input: {
                        type: "table"
                    }
                },
                type: "function",
                desc: "Set the inputs for the given player. Table keys look like this (case sensitive):\n\nup, down, left, right, A, B, start, select\n\nThere are 4 possible values: true, false, nil, and 'invert'.\ntrue    - Forces the button on\nfalse   - Forces the button off\nnil     - User's button press goes through unchanged\n'invert'- Reverses the user's button press\n\nAny string works in place of 'invert'.  It is suggested as a convention to use 'invert' for readability, but strings like 'inv', 'Weird switchy mechanism', '', or 'true or false' works as well as 'invert'.\n\nnil and 'invert' exists so the script can control individual buttons of the controller without entirely blocking the user from having any control. Perhaps there is a process which can be automated by the script, like an optimal firing pattern, but the user still needs some manual control, such as moving the character around.\n\njoypad.write left in for backwards compatibility with older versions of FCEU/FCEUX."
            }
        },
    },
    zapper: {
        type: "module",
        children: {
            read: {
                type: "function",
                returns: "table",
                desc: "Returns the zapper data\nWhen no movie is loaded this input is the same as the internal mouse input (which is used to generate zapper input, as well as the arkanoid paddle).\n\nWhen a movie is playing, it returns the zapper data in the movie code.\n\nThe return table consists of 3 values: x, y, and fire.  x and y are the x,y coordinates of the zapper target in terms of pixels.  fire represents the zapper firing.  0 = not firing, 1 = firing\n\nNote: The zapper is always controller 2 on the NES so there is no player argument to this function."
            }
        },
    },
    input: {
        type: "module",
        children: {
            get: {
                type: "function",
                returns: "table",
                desc: "Reads input from keyboard and mouse. Returns pressed keys and the position of mouse in pixels on game screen.  The function returns a table with at least two properties; table.xmouse and table.ymouse.  Additionally any of these keys will be set to true if they were held at the time of executing this function:\nleftclick, rightclick, middleclick, capslock, numlock, scrolllock, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, F1, F2, F3, F4, F5, F6,  F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F20, F21, F22, F23, F24, backspace, tab, enter, shift, control, alt, pause, escape, space, pageup, pagedown, end, home, left, up, right, down, numpad0, numpad1, numpad2, numpad3, numpad4, numpad5, numpad6, numpad7, numpad8, numpad9, numpad*, insert, delete, numpad+, numpad-, numpad., numpad/, semicolon, plus, minus, comma, period, slash, backslash, tilde, quote, leftbracket, rightbracket.\n\nstring input.popup\nAlias: gui.popup\n\nRequests input from the user using a multiple-option message box. See gui.popup for complete usage and returns."
            },
            read: {
                type: "function",
                returns: "table",
                desc: "Reads input from keyboard and mouse. Returns pressed keys and the position of mouse in pixels on game screen.  The function returns a table with at least two properties; table.xmouse and table.ymouse.  Additionally any of these keys will be set to true if they were held at the time of executing this function:\nleftclick, rightclick, middleclick, capslock, numlock, scrolllock, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, F1, F2, F3, F4, F5, F6,  F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F20, F21, F22, F23, F24, backspace, tab, enter, shift, control, alt, pause, escape, space, pageup, pagedown, end, home, left, up, right, down, numpad0, numpad1, numpad2, numpad3, numpad4, numpad5, numpad6, numpad7, numpad8, numpad9, numpad*, insert, delete, numpad+, numpad-, numpad., numpad/, semicolon, plus, minus, comma, period, slash, backslash, tilde, quote, leftbracket, rightbracket.\n\nstring input.popup\nAlias: gui.popup\n\nRequests input from the user using a multiple-option message box. See gui.popup for complete usage and returns."
            },
            popup: {
                parameters: {
                    message: {
                        type: "string"
                    },
                    type: {
                        type: "string"
                    },
                    icon: {
                        type: "string"
                    }
                },
                type: "function",
                returns: "string",
                desc: "Brings up a modal popup dialog box (everything stops until the user dismisses it). The box displays the message tostring(msg). This function returns the name of the button the user clicked on (as a string).\n\ntype determines which buttons are on the dialog box, and it can be one of the following: 'ok', 'yesno', 'yesnocancel', 'okcancel', 'abortretryignore'.\ntype defaults to 'ok' for gui.popup, or to 'yesno' for input.popup.\n\nicon indicates the purpose of the dialog box (or more specifically it dictates which title and icon is displayed in the box), and it can be one of the following: 'message', 'question', 'warning', 'error'.\nicon defaults to 'message' for gui.popup, or to 'question' for input.popup.\n\nTry to avoid using this function much if at all, because modal dialog boxes can be irritating.\n\nLinux users might want to install xmessage to perform the work. Otherwise the dialog will appear on the shell and that's less noticeable."
            }
        },
    },
    savestate: {
        type: "module",
        children: {
            object: {
                parameters: {
                    slot: {
                        type: "int"
                    }
                },
                type: "function",
                returns: "object",
                desc: "Create a new savestate object. Optionally you can save the current state to one of the predefined slots(1-10) using the range 1-9 for slots 1-9, and 10 for 0, QWERTY style. Using no number will create an 'anonymous' savestate.\nNote that this does not actually save the current state! You need to create this value and pass it on to the load and save functions in order to save it.\n\nAnonymous savestates are temporary, memory only states. You can make them persistent by calling memory.persistent(state). Persistent anonymous states are deleted from disk once the script exits."
            },
            create: {
                parameters: {
                    slot: {
                        type: "int"
                    }
                },
                type: "function",
                returns: "object",
                desc: "savestate.create is identical to savestate.object, except for the numbering for predefined slots(1-10, 1 refers to slot 0, 2-10 refer to 1-9). It's being left in for compatibility with older scripts, and potentially for platforms with different internal predefined slot numbering."
            },
            save: {
                parameters: {
                    savestate: {
                        type: "object"
                    }
                },
                type: "function",
                desc: "Save the current state object to the given savestate. The argument is the result of savestate.create(). You can load this state back up by calling savestate.load(savestate) on the same object."
            },
            load: {
                parameters: {
                    savestate: {
                        type: "object"
                    }
                },
                type: "function",
                desc: "Load the the given state. The argument is the result of savestate.create() and has been passed to savestate.save() at least once.\n\nIf this savestate is not persistent and not one of the predefined states, the state will be deleted after loading."
            },
            persist: {
                parameters: {
                    savestate: {
                        type: "object"
                    }
                },
                type: "function",
                desc: "Set the given savestate to be persistent. It will not be deleted when you load this state but at the exit of this script instead, unless it's one of the predefined states.  If it is one of the predefined savestates it will be saved as a file on disk."
            },
            registersave: {
                parameters: {
                    func: {
                        type: "function"
                    }
                },
                type: "function",
                desc: "Registers a callback function that runs whenever the user saves a state. This won't actually be called when the script itself makes a savestate, so none of those endless loops due to a misplaced savestate.save.\n\nAs with other callback-registering functions provided by FCEUX, there is only one registered callback at a time per registering function per script. Upon registering a second callback, the first is kicked out to make room for the second. In this case, it will return the first function instead of nil, letting you know what was kicked out. Registering nil will clear the previously-registered callback."
            },
            registerload: {
                parameters: {
                    func: {
                        type: "function"
                    }
                },
                type: "function",
                desc: "Registers a callback function that runs whenever the user loads a previously saved state. It's not called when the script itself loads a previous state, so don't worry about your script interrupting itself just because it's loading something.\n\nThe state's data is loaded before this function runs, so you can read the RAM immediately after the user loads a state, or check the new framecount. Particularly useful if you want to update lua's display right away instead of showing junk from before the loadstate."
            },
            loadscriptdata: {
                parameters: {
                    location: {
                        type: "int"
                    }
                },
                type: "function",
                desc: "Accuracy not yet confirmed.\n\nIntended Function, according to snes9x LUA documentation:\nReturns the data associated with the given savestate (data that was earlier returned by a registered save callback) without actually loading the rest of that savestate or calling any callbacks. location should be a save slot number."
            }
        },
    },
    movie: {
        type: "module",
        children: {
            active: {
                type: "function",
                returns: "bool",
                desc: "Returns true if a movie is currently loaded and false otherwise.  (This should be used to guard against Lua errors when attempting to retrieve movie information)."
            },
            framecount: {
                type: "function",
                returns: "int",
                desc: "Returns the current frame count. (Has the same affect as emu.framecount)"
            },
            mode: {
                type: "function",
                returns: "string",
                desc: "Returns the current state of movie playback. Returns one of the following:\n\n- 'record'\n- 'playback'\n- 'finished'\n- 'taseditor'\n- nil"
            },
            rerecordcounting: {
                parameters: {
                    counting: {
                        type: "bool"
                    }
                },
                type: "function",
                desc: "Turn the rerecord counter on or off. Allows you to do some brute forcing without inflating the rerecord count."
            },
            stop: {
                type: "function",
                desc: "Stops movie playback. If no movie is loaded, it throws a Lua error."
            },
            close: {
                type: "function",
                desc: "Stops movie playback. If no movie is loaded, it throws a Lua error."
            },
            length: {
                type: "function",
                returns: "int",
                desc: "Returns the total number of frames of the current movie. Throws a Lua error if no movie is loaded."
            },
            name: {
                type: "function",
                returns: "string",
                desc: "Returns the filename of the current movie with path. Throws a Lua error if no movie is loaded."
            },
            getname: {
                type: "function",
                returns: "string",
                desc: "Returns the filename of the current movie with path. Throws a Lua error if no movie is loaded."
            },
            getfilename: {
                type: "function",
                desc: "Returns the filename of the current movie with no path. Throws a Lua error if no movie is loaded."
            },
            rerecordcount: {
                type: "function",
                desc: "Returns the rerecord count of the current movie. Throws a Lua error if no movie is loaded."
            },
            replay: {
                type: "function",
                desc: "Performs the Play from Beginning function. Movie mode is switched to read-only and the movie loaded will begin playback from frame 1.\n\nIf no movie is loaded, no error is thrown and no message appears on screen."
            },
            playbeginning: {
                type: "function",
                desc: "Performs the Play from Beginning function. Movie mode is switched to read-only and the movie loaded will begin playback from frame 1.\n\nIf no movie is loaded, no error is thrown and no message appears on screen."
            },
            readonly: {
                type: "function",
                returns: "bool",
                desc: "Alias: emu.getreadonly\nFCEUX keeps the read-only status even without a movie loaded.\n\nReturns whether the emulator is in read-only state.  \n\nWhile this variable only applies to movies, it is stored as a global variable and can be modified even without a movie loaded.  Hence, it is in the emu library rather than the movie library."
            },
            getreadonly: {
                type: "function",
                returns: "bool",
                desc: "Alias: emu.getreadonly\nFCEUX keeps the read-only status even without a movie loaded.\n\nReturns whether the emulator is in read-only state.  \n\nWhile this variable only applies to movies, it is stored as a global variable and can be modified even without a movie loaded.  Hence, it is in the emu library rather than the movie library."
            },
            setreadonly: {
                parameters: {
                    state: {
                        type: "bool"
                    }
                },
                type: "function",
                desc: "Alias: emu.setreadonly\nFCEUX keeps the read-only status even without a movie loaded.\n\nSets the read-only status to read-only if argument is true and read+write if false.\nNote: This might result in an error if the medium of the movie file is  not writeable (such as in an archive file).\n\nWhile this variable only applies to movies, it is stored as a global variable and can be modified even without a movie loaded.  Hence, it is in the emu library rather than the movie library."
            },
            recording: {
                type: "function",
                returns: "bool",
                desc: "Returns true if there is a movie loaded and in record mode."
            },
            playing: {
                type: "function",
                returns: "bool",
                desc: "Returns true if there is a movie loaded and in play mode."
            },
            ispoweron: {
                type: "function",
                returns: "bool",
                desc: "Returns true if the movie recording or loaded started from 'Start'.\nReturns false if the movie uses a save state.\nOpposite of movie.isfromsavestate()"
            },
            isfromsavestate: {
                type: "function",
                returns: "bool",
                desc: "Returns true if the movie recording or loaded started from 'Now'.\nReturns false if the movie was recorded from a reset.\nOpposite of movie.ispoweron()"
            },
        },
    },
    gui: {
        type: "module",
        children: {
            pixel: {
                parameters: {
                    x: {
                        type: "int"
                    },
                    y: {
                        type: "int"
                    },
                    color: {
                        type: "type"
                    }
                },
                type: "function",
                desc: "Draw one pixel of a given color at the given position on the screen. See drawing notes and color notes at the bottom of the page.  "
            },


            drawpixel: {
                parameters: {
                    x: {
                        type: "int"
                    },
                    y: {
                        type: "int"
                    },
                    color: {
                        type: "type"
                    }
                },
                type: "function",
                desc: "Draw one pixel of a given color at the given position on the screen. See drawing notes and color notes at the bottom of the page.  "
            },


            setpixel: {
                parameters: {
                    x: {
                        type: "int"
                    },
                    y: {
                        type: "int"
                    },
                    color: {
                        type: "type"
                    }
                },
                type: "function",
                desc: "Draw one pixel of a given color at the given position on the screen. See drawing notes and color notes at the bottom of the page.  "
            },


            writepixel: {
                parameters: {
                    x: {
                        type: "int"
                    },
                    y: {
                        type: "int"
                    },
                    color: {
                        type: "type"
                    }
                },
                type: "function",
                desc: "Draw one pixel of a given color at the given position on the screen. See drawing notes and color notes at the bottom of the page.  "
            },


            getpixel: {
                parameters: {
                    x: {
                        type: "int"
                    },
                    y: {
                        type: "int"
                    }
                },
                type: "function",
                desc: "Returns the separate RGBA components of the given pixel set by gui.pixel. This only gets LUA pixels set, not background colors.\n\nUsage is local r,g,b,a = gui.getpixel(5, 5) to retrieve the current red/green/blue/alpha values of the LUA pixel at 5x5.\n\nSee emu.getscreenpixel() for an emulator screen variant."
            },


            line: {
                parameters: {
                    x1: {
                        type: "int"
                    },
                    y1: {
                        type: "int"
                    },
                    x2: {
                        type: "int"
                    },
                    y2: {
                        type: "int"
                    },
                    color: {
                        type: "unspecified"
                    },
                    skipfirst: {
                        type: "unspecified"
                    }
                },
                type: "function",
                desc: "Draws a line between the two points. The x1,y1 coordinate specifies one end of the line segment, and the x2,y2 coordinate specifies the other end. If skipfirst is true then this function will not draw anything at the pixel x1,y1, otherwise it will. skipfirst is optional and defaults to false. The default color for the line is solid white, but you may optionally override that using a color of your choice. See also drawing notes and color notes at the bottom of the page."
            },


            drawline: {
                parameters: {
                    x1: {
                        type: "int"
                    },
                    y1: {
                        type: "int"
                    },
                    x2: {
                        type: "int"
                    },
                    y2: {
                        type: "int"
                    },
                    color: {
                        type: "unspecified"
                    },
                    skipfirst: {
                        type: "unspecified"
                    }
                },
                type: "function",
                desc: "Draws a line between the two points. The x1,y1 coordinate specifies one end of the line segment, and the x2,y2 coordinate specifies the other end. If skipfirst is true then this function will not draw anything at the pixel x1,y1, otherwise it will. skipfirst is optional and defaults to false. The default color for the line is solid white, but you may optionally override that using a color of your choice. See also drawing notes and color notes at the bottom of the page."
            },


            box: {
                parameters: {
                    x1: {
                        type: "int"
                    },
                    y1: {
                        type: "int"
                    },
                    x2: {
                        type: "int"
                    },
                    y2: {
                        type: "int"
                    },
                    fillcolor: {
                        type: "unspecified"
                    },
                    outlinecolor: {
                        type: "unspecified"
                    }
                },
                type: "function",
                desc: "Draws a rectangle between the given coordinates of the emulator screen for one frame. The x1,y1 coordinate specifies any corner of the rectangle (preferably the top-left corner), and the x2,y2 coordinate specifies the opposite corner.\n\nThe default color for the box is transparent white with a solid white outline, but you may optionally override those using colors of your choice. Also see drawing notes and color notes."
            },


            drawbox: {
                parameters: {
                    x1: {
                        type: "int"
                    },
                    y1: {
                        type: "int"
                    },
                    x2: {
                        type: "int"
                    },
                    y2: {
                        type: "int"
                    },
                    fillcolor: {
                        type: "unspecified"
                    },
                    outlinecolor: {
                        type: "unspecified"
                    }
                },
                type: "function",
                desc: "Draws a rectangle between the given coordinates of the emulator screen for one frame. The x1,y1 coordinate specifies any corner of the rectangle (preferably the top-left corner), and the x2,y2 coordinate specifies the opposite corner.\n\nThe default color for the box is transparent white with a solid white outline, but you may optionally override those using colors of your choice. Also see drawing notes and color notes."
            },


            rect: {
                parameters: {
                    x1: {
                        type: "int"
                    },
                    y1: {
                        type: "int"
                    },
                    x2: {
                        type: "int"
                    },
                    y2: {
                        type: "int"
                    },
                    fillcolor: {
                        type: "unspecified"
                    },
                    outlinecolor: {
                        type: "unspecified"
                    }
                },
                type: "function",
                desc: "Draws a rectangle between the given coordinates of the emulator screen for one frame. The x1,y1 coordinate specifies any corner of the rectangle (preferably the top-left corner), and the x2,y2 coordinate specifies the opposite corner.\n\nThe default color for the box is transparent white with a solid white outline, but you may optionally override those using colors of your choice. Also see drawing notes and color notes."
            },


            drawrect: {
                parameters: {
                    x1: {
                        type: "int"
                    },
                    y1: {
                        type: "int"
                    },
                    x2: {
                        type: "int"
                    },
                    y2: {
                        type: "int"
                    },
                    fillcolor: {
                        type: "unspecified"
                    },
                    outlinecolor: {
                        type: "unspecified"
                    }
                },
                type: "function",
                desc: "Draws a rectangle between the given coordinates of the emulator screen for one frame. The x1,y1 coordinate specifies any corner of the rectangle (preferably the top-left corner), and the x2,y2 coordinate specifies the opposite corner.\n\nThe default color for the box is transparent white with a solid white outline, but you may optionally override those using colors of your choice. Also see drawing notes and color notes."
            },


            text: {
                parameters: {
                    x: {
                        type: "int"
                    },
                    y: {
                        type: "int"
                    },
                    str: {
                        type: "string"
                    },
                    textcolor: {
                        type: "unspecified"
                    },
                    backcolor: {
                        type: "unspecified"
                    }
                },
                type: "function",
                desc: "Draws a given string at the given position. textcolor and backcolor are optional. See 'on colors' at the end of this page for information. Using nil as the input or not including an optional field will make it use the default."
            },


            drawtext: {
                parameters: {
                    x: {
                        type: "int"
                    },
                    y: {
                        type: "int"
                    },
                    str: {
                        type: "string"
                    },
                    textcolor: {
                        type: "unspecified"
                    },
                    backcolor: {
                        type: "unspecified"
                    }
                },
                type: "function",
                desc: "Draws a given string at the given position. textcolor and backcolor are optional. See 'on colors' at the end of this page for information. Using nil as the input or not including an optional field will make it use the default."
            },


            parsecolor: {
                parameters: {
                    color: {
                        type: "unspecified"
                    }
                },
                type: "function",
                desc: "Returns the separate RGBA components of the given color.\nFor example, you can say local r,g,b,a = gui.parsecolor('orange') to retrieve the red/green/blue values of the preset color orange. (You could also omit the a in cases like this.) This uses the same conversion method that FCEUX uses internally to support the different representations of colors that the GUI library uses. Overriding this function will not change how FCEUX interprets color values, however."
            },


            savescreenshot: {
                type: "function",
                desc: "Makes a screenshot of the FCEUX emulated screen, and saves it to the appropriate folder. Performs identically to pressing the Screenshot hotkey."
            },


            savescreenshotas: {
                parameters: {
                    name: {
                        type: "string"
                    }
                },
                type: "function",
                desc: "Makes a screenshot of the FCEUX emulated screen, and saves it to the appropriate folder. However, this one receives a file name for the screenshot.\nstring gui.gdscreenshot()\n\nTakes a screen shot of the image and returns it in the form of a string which can be imported by the gd library using the gd.createFromGdStr() function.\n\nThis function is provided so as to allow FCEUX to not carry a copy of the gd library itself. If you want raw RGB32 access, skip the first 11 bytes (header) and then read pixels as Alpha (always 0), Red, Green, Blue, left to right then top to bottom, range is 0-255 for all colors.\n\nWarning: Storing screen shots in memory is not recommended. Memory usage will blow up pretty quick. One screen shot string eats around 230 KB of RAM."
            },


            gdoverlay: {
                parameters: {
                    dx: {
                        type: "int"
                    },
                    dy: {
                        type: "int"
                    },
                    str: {
                        type: "string"
                    },
                    sx: {
                        type: "unspecified"
                    },
                    sy: {
                        type: "unspecified"
                    },
                    sw: {
                        type: "unspecified"
                    },
                    sh: {
                        type: "unspecified"
                    },
                    alphamul: {
                        type: "float"
                    }
                },
                type: "function",
                desc: "Draws an image on the screen. gdimage must be in truecolor gd string format.\n\nTransparency is fully supported. Also, if alphamul is specified then it will modulate the transparency of the image even if it's originally fully opaque. (alphamul=1.0 is normal, alphamul=0.5 is doubly transparent, alphamul=3.0 is triply opaque, etc.)\n\ndx,dy determines the top-left corner of where the image should draw. If they are omitted, the image will draw starting at the top-left corner of the screen.\n\ngui.gdoverlay is an actual drawing function (like gui.box and friends) and thus must be called every frame, preferably inside a gui.register'd function, if you want it to appear as a persistent image onscreen."
            },


            image: {
                parameters: {
                    dx: {
                        type: "int"
                    },
                    dy: {
                        type: "int"
                    },
                    str: {
                        type: "string"
                    },
                    sx: {
                        type: "unspecified"
                    },
                    sy: {
                        type: "unspecified"
                    },
                    sw: {
                        type: "unspecified"
                    },
                    sh: {
                        type: "unspecified"
                    },
                    alphamul: {
                        type: "float"
                    }
                },
                type: "function",
                desc: "Draws an image on the screen. gdimage must be in truecolor gd string format.\n\nTransparency is fully supported. Also, if alphamul is specified then it will modulate the transparency of the image even if it's originally fully opaque. (alphamul=1.0 is normal, alphamul=0.5 is doubly transparent, alphamul=3.0 is triply opaque, etc.)\n\ndx,dy determines the top-left corner of where the image should draw. If they are omitted, the image will draw starting at the top-left corner of the screen.\n\ngui.gdoverlay is an actual drawing function (like gui.box and friends) and thus must be called every frame, preferably inside a gui.register'd function, if you want it to appear as a persistent image onscreen."
            },


            drawimage: {
                parameters: {
                    dx: {
                        type: "int"
                    },
                    dy: {
                        type: "int"
                    },
                    str: {
                        type: "string"
                    },
                    sx: {
                        type: "unspecified"
                    },
                    sy: {
                        type: "unspecified"
                    },
                    sw: {
                        type: "unspecified"
                    },
                    sh: {
                        type: "unspecified"
                    },
                    alphamul: {
                        type: "float"
                    }
                },
                type: "function",
                desc: "Draws an image on the screen. gdimage must be in truecolor gd string format.\n\nTransparency is fully supported. Also, if alphamul is specified then it will modulate the transparency of the image even if it's originally fully opaque. (alphamul=1.0 is normal, alphamul=0.5 is doubly transparent, alphamul=3.0 is triply opaque, etc.)\n\ndx,dy determines the top-left corner of where the image should draw. If they are omitted, the image will draw starting at the top-left corner of the screen.\n\ngui.gdoverlay is an actual drawing function (like gui.box and friends) and thus must be called every frame, preferably inside a gui.register'd function, if you want it to appear as a persistent image onscreen."
            },


            opacity: {
                parameters: {
                    alpha: {
                        type: "int"
                    }
                },
                type: "function",
                desc: "Scales the transparency of subsequent draw calls. An alpha of 0.0 means completely transparent, and an alpha of 1.0 means completely unchanged (opaque). Non-integer values are supported and meaningful, as are values greater than 1.0. It is not necessary to use this function (or the less-recommended gui.transparency) to perform drawing with transparency, because you can provide an alpha value in the color argument of each draw call. However, it can sometimes be convenient to be able to globally modify the drawing transparency."
            },


            transparency: {
                parameters: {
                    trans: {
                        type: "int"
                    }
                },
                type: "function",
                desc: "Scales the transparency of subsequent draw calls. Exactly the same as gui.opacity, except the range is different: A trans of 4.0 means completely transparent, and a trans of 0.0 means completely unchanged (opaque)."
            },


            register: {
                parameters: {
                    func: {
                        type: "function"
                    }
                },
                type: "function",
                returns: "function",
                desc: "Register a function to be called between a frame being prepared for displaying on your screen and it actually happening. Used when that 1 frame delay for rendering is not acceptable."
            },


            popup: {
                parameters: {
                    message: {
                        type: "string"
                    },
                    type: {
                        type: "string"
                    },
                    icon: {
                        type: "string"
                    }
                },
                type: "function",
                returns: "string",
                desc: "Brings up a modal popup dialog box (everything stops until the user dismisses it). The box displays the message tostring(msg). This function returns the name of the button the user clicked on (as a string).\n\ntype determines which buttons are on the dialog box, and it can be one of the following: 'ok', 'yesno', 'yesnocancel', 'okcancel', 'abortretryignore'.\ntype defaults to 'ok' for gui.popup, or to 'yesno' for input.popup.\n\nicon indicates the purpose of the dialog box (or more specifically it dictates which title and icon is displayed in the box), and it can be one of the following: 'message', 'question', 'warning', 'error'.\nicon defaults to 'message' for gui.popup, or to 'question' for input.popup.\n\nTry to avoid using this function much if at all, because modal dialog boxes can be irritating.\n\nLinux users might want to install xmessage to perform the work. Otherwise the dialog will appear on the shell and that's less noticeable."
            }

        },
    },
    sound: {
        type: "module",
        children: {
            get: {
                type: "function",
                returns: "table",
                desc: "Returns current state of PSG channels in big array."
            }
        },
    },
    taseditor: {
        type: "module",
        children: {},
    }
};