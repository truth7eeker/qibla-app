const REDIRECT_URL = process.env.REACT_APP_REDIRECT_URL;

const test = "?latitude=55.453682&longitude=65.375819&user_id=381868674";

const getParams = (search) => {
    const params = {}
    const pairs = search.split('?')[1].split('&')
    for (let i= 0; i < pairs.length; i++) {
      const pair = pairs[i].split('=')
      params[pair[0]] = pair[1]
    }
  return params;
};

export const handleRedirect = () => {
  const search = window.location.search;
  if (search) {
    const coords = getParams(search);
    window.location.assign(`${REDIRECT_URL}?longitude=${coords.longitude}&latitude=${coords.latitude}&zoom=17&t=m `)
  } else {
    window.location.assign(REDIRECT_URL);
  }
};
