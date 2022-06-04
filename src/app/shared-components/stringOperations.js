class StringOperations {
  capitalizeWords = (mySentence) => {
    if (mySentence) {
      const words = mySentence.toLowerCase().split(' ');

      for (let i = 0; i < words.length; i++) {
        if (words[i] !== '') {
          words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }
      }

      return words.join(' ');
    }
    return mySentence;
  };

  capitalizeFirst = (mySentence) => {
    if (mySentence) {
      mySentence = mySentence.toLowerCase();
      return mySentence[0].toUpperCase() + mySentence.substr(1);
    }
    return mySentence;
  };

  datetimeStringToDateTime = (datetimeString) => {
    if (!(datetimeString instanceof Date)) {
      const dateTimeParts = datetimeString.split(' ');
      const timeParts = dateTimeParts[1].split(':');
      const dateParts = dateTimeParts[0].split('-');

      const date = new Date(
        dateParts[0],
        parseInt(dateParts[1], 10) - 1,
        dateParts[2],
        timeParts[0],
        timeParts[1]
      );

      return date;
    }

    return datetimeString;
  };

  hoursLocaleTimeZone = () => {
    const date = new Date();
    const offset = date.getTimezoneOffset();
    return offset / 60.0;
  };

  getLocaleDateTime = (datetimeString) => {
    const timeStamp = this.datetimeStringToDateTime(datetimeString).getTime();
    const timeStampLocale = timeStamp - this.hoursLocaleTimeZone() * 60 * 60 * 1000;
    return new Date(timeStampLocale);
  };

  setDateTimeString = (dateTime) => {
    if (dateTime instanceof Date) {
      const newDateTimeString =
        dateTime.getFullYear() +
        '-' +
        ('0' + (dateTime.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + dateTime.getDate()).slice(-2) +
        ' ' +
        dateTime.getHours() +
        ':' +
        dateTime.getMinutes();
      return newDateTimeString;
    }
    return dateTime;
  };
}

const instance = new StringOperations();

export default instance;
