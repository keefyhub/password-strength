class PasswordStrength {
  constructor(formElement, requirementsElement, options, regexOptions) {
    const defaults = {
      length: 8,
      lowercase: 1,
      uppercase: 1,
      numbers: 1,
      specialChars: 1,
    };

    this.options = { ...defaults, ...options };

    const regexDefaults = {
      lowercase: new RegExp(/[a-z]/, "g"),
      uppercase: new RegExp(/[A-Z]/, "g"),
      numbers: new RegExp(/[0-9]/, "g"),
      specialChars: new RegExp(/.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?]/, "g"),
    };

    this.regexOptions = { ...regexDefaults, ...regexOptions };

    this.counts = {
      lowercaseCount: 0,
      uppercaseCount: 0,
      numbersCount: 0,
      specialCharsCount: 0,
    };

    this.valid = {
      length: false,
      lowercase: false,
      uppercase: false,
      numbers: false,
      specialChars: false,
    };

    this.valid = this.removeFalsy(this.options, this.valid);

    this.requirementsElement = requirementsElement;

    formElement.addEventListener("keyup", this.checkStrength.bind(this));

    this.setupRequirements(requirementsElement, this.options);
  }

  checkStrength(e) {
    const value = e.currentTarget.value;

    if (this.options.length !== false) {
      this.counts.length = value.length;
      console.log(`contains ${this.counts.length} characters`);

      if (value.length >= this.options.length) {
        this.valid.length = true;
        this.addClass(this.requirementsElement.querySelector('[data-rule="length"]'), "is-valid");
      } else {
        this.valid.length = false;
        this.removeClass(this.requirementsElement.querySelector('[data-rule="length"]'), "is-valid");
      }
    }

    if (value.match(this.regexOptions.lowercase) && this.options.lowercase !== false) {
      this.counts.lowercaseCount = this.countMatches(value, this.regexOptions.lowercase);
      console.log(`contains ${this.counts.lowercaseCount} lowercase`);

      if (this.counts.lowercaseCount >= this.options.lowercase) {
        this.valid.lowercase = true;
        this.addClass(this.requirementsElement.querySelector('[data-rule="lowercase"]'), "is-valid");
      } else {
        this.valid.lowercase = false;
        this.removeClass(this.requirementsElement.querySelector('[data-rule="lowercase"]'), "is-valid");
      }
    }

    if (value.match(this.regexOptions.uppercase) && this.options.uppercase !== false) {
      this.counts.uppercaseCount = this.countMatches(value, this.regexOptions.uppercase);
      console.log(`contains ${this.counts.uppercaseCount} uppercase`);

      if (this.counts.uppercaseCount >= this.options.uppercase) {
        this.valid.uppercase = true;
        this.addClass(this.requirementsElement.querySelector('[data-rule="uppercase"]'), "is-valid");
      } else {
        this.valid.uppercase = false;
        this.removeClass(this.requirementsElement.querySelector('[data-rule="uppercase"]'), "is-valid");
      }
    }

    if (value.match(this.regexOptions.numbers) && this.options.numbers !== false) {
      this.counts.numbersCount = this.countMatches(value, this.regexOptions.numbers);
      console.log(`contains ${this.counts.numbersCount} numbers`);

      if (this.counts.numbersCount >= this.options.numbers) {
        this.valid.numbers = true;
        this.addClass(this.requirementsElement.querySelector('[data-rule="numbers"]'), "is-valid");
      } else {
        this.valid.numbers = false;
        this.removeClass(this.requirementsElement.querySelector('[data-rule="numbers"]'), "is-valid");
      }
    }

    if (value.match(this.regexOptions.specialChars) && this.options.specialChars !== false) {
      this.counts.specialCharsCount = this.countMatches(value, this.regexOptions.specialChars);
      console.log(`contains ${this.counts.specialCharsCount} special characters`);

      if (this.counts.specialCharsCount >= this.options.specialChars) {
        this.valid.specialChars = true;
        this.addClass(this.requirementsElement.querySelector('[data-rule="specialChars"]'), "is-valid");
      } else {
        this.valid.specialChars = false;
        this.removeClass(this.requirementsElement.querySelector('[data-rule="specialChars"]'), "is-valid");
      }
    }

    if (this.isValid(this.valid)) {
      console.log("all requirements met");
    }
  }

  setupRequirements(element) {
    Object.entries(this.options).forEach(([key, value]) => {
      if (value !== false) {
        const listItem = document.createElement("li");
        listItem.setAttribute("data-rule", key);

        const itemIsValid = document.createElement("span");
        let text = document.createTextNode(`${value}`);

        if (key === "length") {
          text = document.createTextNode(`${value}+ characters`);
        }

        if (key === "lowercase" || key === "uppercase") {
          text = document.createTextNode(`${value}+ ${key} ${this.maybePluralize(value, "letter")}`);
        }

        if (key === "numbers") {
          text = document.createTextNode(`${value}+ ${this.maybePluralize(value, "number")}`);
        }

        if (key === "specialChars") {
          text = document.createTextNode(`${value}+ ${this.maybePluralize(value, "special character")}`);
        }

        listItem.appendChild(itemIsValid);
        listItem.appendChild(text);
        element.appendChild(listItem);
      }
    });
  }

  maybePluralize = (count, noun, suffix = "s") => {
    return `${noun}${count !== 1 ? suffix : ""}`;
  };

  countMatches = (str, pattern) => {
    return ((str || "").match(pattern) || []).length;
  };

  addClass(element, className) {
    return element.classList.add(className);
  }

  removeClass(element, className) {
    return element.classList.remove(className);
  }

  removeFalsy(object, isValid) {
    let newObject = {};

    Object.keys(object).forEach((prop) => {
      if (object[prop]) {
        newObject[prop] = isValid[prop];
      }
    });

    return newObject;
  }

  isValid(isValid) {
    return Object.values(isValid).every(Boolean);
  }
}

// module.exports = PasswordStrength;
const defaults = {
  // length: 4,
  // lowercase: false,
  // uppercase: false,
  // numbers: false,
  // specialChars: false,
};

new PasswordStrength(document.querySelector("#new-password"), document.querySelector(".password-strength-requirements"), defaults);
