class StringOperations {
  capitalizeWords = (mySentence) => {
    const words = mySentence.toLowerCase().split(' ');

    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }

    return words.join(' ');
  };
}

const instance = new StringOperations();

export default instance;
