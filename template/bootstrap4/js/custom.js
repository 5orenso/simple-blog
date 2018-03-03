
function simpleBlog() {
    function getElement(elementId) {
        return document.getElementById(elementId);
    }

    function getElementAttribute(elementId) {
        const element = document.getElementById(elementId);
        if (element && element.src) {
            return element.src;
        }
        return '';
    }

    function getSelectedValue(elementId) {
        const element = document.getElementById(elementId);
        if (element && element.selectedIndex) {
            return element.options[element.selectedIndex].text;
        }
        return undefined;
    }

    function elementExists(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            return true;
        }
        return false;
    }
    return {
        getElement,
        getElementAttribute,
        getSelectedValue,
        elementExists,
    }
}

module.exports = simpleBlog;
