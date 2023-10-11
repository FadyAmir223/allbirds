const userData = {
  firstName: 'fady',
  lastName: 'amir',
  email: 'fadyamir23@gmail.com',
  password: 'P@ssw0rd',
  confirmPassword: 'P@ssw0rd',
};

const loginData = { username: userData.email, password: userData.password };

const adminData = { ...userData, email: 'fadyamir223@gmail.com' };

const loginAdminData = { ...loginData, username: adminData.email };

const location = {
  company: 'company',
  address: '123 street',
  city: 'city',
  country: 'country',
  state: 'state',
  zipCode: 12345,
  phone: '1111',
};

const editLocation = {
  state: 'ctatfonia',
  zipCode: 9876,
  phone: '5555',
};

const product = {
  handle: 'mens-tree-runners',
  editionId: 6660112482384,
  size: '9',
};

const product_2nd = { ...product, size: '10' };

const productSoldOut = { ...product, size: '8' };

const productToRemove = { editionId: product.editionId, size: product.size };

const productReview = {
  score: 4,
  title: 'fucking amazing',
  content: 'the best in this sh1t world',
  customFields: [
    { title: 'Typical Size', value: '9' },
    { title: 'Typical Width', value: 'Average' },
    { title: 'Size Purchased', value: '9' },
    { title: 'Overall Fit', value: 'Just Right' },
    { title: 'Activity Level', value: 'Walking, Traveling' },
  ],
};

export {
  userData,
  loginData,
  adminData,
  loginAdminData,
  location,
  editLocation,
  product,
  product_2nd,
  productSoldOut,
  productToRemove,
  productReview,
};
