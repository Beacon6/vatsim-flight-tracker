export const shuffleArray = (arr: Array<any>): Array<any> => {
  for (let i = arr.length - 1; i > 1; i--) {
    const j = Math.floor(Math.random() * i);

    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }

  return arr;
};
