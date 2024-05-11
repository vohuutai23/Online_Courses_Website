//***********************************************REGISTER USER************************** */

const registerUser = async (name, email, password, confirmPassword) => {
  if (!name || !email || !password || !confirmPassword) {
    throw Error("Please fill all the fields");
  }

  if (password !== confirmPassword) {
    throw Error("Passwords do not match!");
  }

  const res = await fetch("/api/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw Error(data.error);
  }

  localStorage.setItem("token", data.token);

  return data;
};

//***********************************************LOGIN USER************************** */

const loginUser = async (email, password) => {
  if (!email || !password) {
    throw Error("Please fill all the fields");
  }

  const res = await fetch("/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw Error(data.error);
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("cartId",data.cartId);

  console.log("user:", localStorage.getItem("token", data.token));
  console.log("cart:", localStorage.getItem("cartId", data.token));
  return data;
};

//***********************************************LOGIN USER SOCIAL************************** */

const loginUserSocial = async () => {
  const res = await fetch("http://localhost:5000/auth/login/success", {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw Error(data.error);
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);

  return data;
};

//***********************************************FORGOT PASSWORD USER************************** */
const checkEmailUser = async (email) => {
  if (!email) {
    throw Error("Please fill all the fields");
  }

  const res = await fetch("/api/users/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw Error(data.error);
  }
};

//***********************************************FORGOT PASSWORD USER************************** */
const resetPasswordUser = async (id, token, password) => {
  // if (!password || !confirmPassword) {
  //   throw Error("Please fill all the fields");
  // }

  // if (password !== confirmPassword) {
  //   throw Error("Passwords do not match!");
  // }

  const res = await fetch(`/api/users/reset-password/${id}/${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  // Xử lý response ở đây nếu cần
  // const data = await res.json()
  // if(!res.ok) {
  //     throw Error(data.error)
  // }
};

//***********************************************REGISTER USER************************** */

const updateUserProfile = async (formData) => {
  try {
    console.log(formData);

    const res = await fetch("/api/users/update-profile", {
      method: "PUT",
      body: formData,
      // crossDomain: true,
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to update profile");
    }
    console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to update profile:", error.message);
    throw error;
  }
};

//***********************************************GET USER************************** */
const getUser = async (token) => {
  const res = await fetch("/api/users/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bear ${token}`,
    },
  });
  const { user } = await res.json();
  return user;
};

const getUserListByRole = async (role) => {
  const res = await fetch(`/api/users/get-list-users/${role}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bear ${localStorage.getItem("token")}`,
    },
  });

  const data = await res.json();
  return data.users;
};

const changeUserStatus = async (id) => {
  const res = await fetch(`/api/users/change-user-status/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bear ${localStorage.getItem("token")}`,
    },
  });
  const data = await res.json();
  return data;
};

export {
  registerUser,
  loginUser,
  loginUserSocial,
  checkEmailUser,
  resetPasswordUser,
  updateUserProfile,
  getUser,
  getUserListByRole,
  changeUserStatus,
};
