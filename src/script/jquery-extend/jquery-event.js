/**
 * <%= pkg.name %> jquery-event, extend jQuery event
 * @class Event
 * @static
 */
var Event = {
    /**
     * Cancel event
     * @method cancel
     */
    cancel: function () {
        this.stopPropagation(); // to prevent event from bubbling up
        this.preventDefault(); // then cancel the event (if it's cancelable)
        return false;
    },
    /**
     * Detect if the key event is an combination key. (shift, ctrl, alt has been also pressed)
     * @method isCombinationKey
     * @return {Boolean}
     */
    isCombinationKey: function () {
        return this.shiftKey || this.altKey || this.ctrlKey;
    },
    /**
     * Detect if the key event is enter key.
     * @method isEnterKey
     * @return {Boolean}
     */
    isEnterKey: function () {
        return !this.isCombinationKey() && this.keyCode == 13;
    },
    /**
     * Detect if the key event is a esc key.
     * @method isEscapeKey
     * @return {Boolean}
     */
    isEscapeKey: function () {
        return !this.isCombinationKey() && this.keyCode == 27;
    },
    /**
     * Detect if the key event is a space key.
     * @method isSpaceKey
     * @return {Boolean}
     */
    isSpaceKey: function () {
        return !this.isCombinationKey() && this.keyCode == 32;
    },
    /**
     * Detect if the key event is a pause key.
     * @method isPauseKey
     * @return {Boolean}
     */
    isPauseKey: function () {
        return !this.isCombinationKey() && this.keyCode == 32;
    },
    /**
     * Detect if the key event is a select key.
     * @method isSelectKey
     * @return {Boolean}
     */
    isSelectKey: function () {
        return !this.isCombinationKey() && this.keyCode == 32;
    },
    /**
     * Detect if the key event is a window key.
     * @method isWindowKey
     * @return {Boolean}
     */
    isWindowKey: function () {
        return !this.isCombinationKey() && (this.keyCode == 91 || this.keyCode == 92);
    },
    /**
     * Detect if the key event is a numeric. (0-9)
     * @method isNumericKey
     * @return {Boolean}
     */
    isNumericKey: function () {
        var keyCode = this.keyCode;
        return (!this.isCombinationKey() && keyCode > 47 && keyCode < 65) || (keyCode > 95 && keyCode < 106);
    },
    /**
     * Detect if the key event is an alphabet. (a-zA-Z)
     * @method isAlphabetKey
     * @return {Boolean}
     */
    isAlphabetKey: function () {
        var keyCode = this.keyCode;
        return !this.isCombinationKey() && keyCode > 64 && keyCode < 96;
    },
    /**
     * Detect if the key event is a symbol. "`~!@#$%^&*()-_=+[{]}\|;:'",<.>/?"
     * @method isSymbolKey
     * @return {Boolean}
     */
    isSymbolKey: function () {
        var keyCode = this.keyCode;
        return (this.shiftKey && keyCode > 47 && keyCode < 65) || //with shift key: "!", "@", "#", "$", "%", "^", "&", "*", "(", ")"
            (!this.ctrlKey && !this.altKey && ( //should without ctrl key or alt key
                (keyCode > 105 && keyCode < 112) || //numeric keypad: "/", "*", "-", "+", "."
                (keyCode > 185 && keyCode < 193) || //";", "=", ",", "-", ".", "/", "`"
                (keyCode > 218 && keyCode < 223) //"[", "\", "]", "'";
                ));
    },
    /**
     * Detect if the key event is an operation. (backspace, tab, clear, page_up, page_down, home, end, left, up, right, down, select, print, execute, ?, insert, delete)
     * @method isOperationKey
     * @return {Boolean}
     */
    isOperationKey: function () {
        var keyCode = this.keyCode;
        return !this.isCombinationKey() && (
            keyCode == 8 || //backspace
            keyCode == 9 || //tab
            keyCode == 12 || //clear(KP_5 when close num_lock)
            (keyCode > 32 && keyCode < 46) //page_up, page_down, home, end, left, up, right, down, select, print, execute, ?, insert, delete
            );
    },
    /**
     * Detect if the key event is lock key. (caps_Lock, scroll_Lock, num_lock)
     * @method isLockKey
     * @return {Boolean}
     */
    isLockKey: function () {
        return [20, 144, 145].indexOf(this.keyCode);
    },
    /**
     * Detect if the key event is an operation. (F1~F12)
     * @method isFunctionKey
     * @return {Boolean}
     */
    isFunctionKey: function () {
        var keyCode = this.keyCode;
        return !this.isCombinationKey() && keyCode > 111 && keyCode < 124;
    },
    /**
     * Detect if the mouse click is right click.
     * @method isRightClick
     * @return {Boolean}
     */
    isRightClick: function () {
        var which = this.which;
        return !this.isCombinationKey() && which == 3;
    },
    /**
     * Detect if the mouse click is wheel click.
     * @method isWheelClick
     * @return {Boolean}
     */
    isWheelClick: function () {
        var which = this.which;
        return !this.isCombinationKey() && which == 2;
    }
};
_.extend(Event, $.Event.prototype);