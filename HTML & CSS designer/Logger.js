/***
 * 
 * Class Logger for debugging perposes
 * 
 */


class Logger    {

    constructor(level)  {

        this.level = level;
        this.buffer = [];

        this.ERROR_LEVEL = 0;
        this.WARNNING_LEVEL = 1;
        this.INFO_LEVEL = 2;

    }

    error(msg)  {
        if (this.level >= this.ERROR_LEVEL) {
            console.log(`%c[ERROR]  : %c` + msg, 'color: red', '');
        }

        this.buffer.push(`[ERROR]  : ` + msg);
    }

    warn(msg)  {
        if (this.level >= this.WARNNING_LEVEL) {
            console.log(`%c[WARNNING]  : %c` + msg, 'color: yellow', '');
        }

        this.buffer.push(`[WARNNING]  : ` + msg);
    }

    info(msg)  {
        if (this.level >= this.INFO_LEVEL) {
            console.log(`%c[INFO]  : %c` + msg, 'color: green', '');
        }

        this.buffer.push(`[INFO]  : ` + msg);
    }

}