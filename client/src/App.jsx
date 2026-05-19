import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const fetchVehicles = async () => {
  try {
    const response = await axios.get("http://localhost:5000/vehicles");
    setVehicleList(response.data);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
  }
};

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [admins, setAdmins] = useState([
    {
      email: "rahul@tollsync.com",
      password: "Rahul123",
      name: "Rahul",
      role: "Super Admin",
      status: "Inactive",
    },
    {
      email: "sneha@tollsync.com",
      password: "Sneha123",
      name: "Sneha",
      role: "Toll Manager",
      status: "Inactive",
    },
    {
      email: "amit@tollsync.com",
      password: "Amit123",
      name: "Amit",
      role: "Operator",
      status: "Inactive",
    },
  ]);

  useEffect(() => {

  const savedUser =
    localStorage.getItem(
      "loggedInUser"
    );

  if (savedUser) {

    const parsedUser =
      JSON.parse(savedUser);

    setCurrentUser(parsedUser);

    setIsLoggedIn(true);
  }

}, []);

  const [currentUser, setCurrentUser] = useState(null);

  const [vehicleList, setVehicleList] = useState([]);

  useEffect(() => {
  fetchVehicles();
}, []);

const fetchVehicles = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/vehicles"
    );

    setVehicleList(response.data);
  } catch (error) {
    console.log(error);
  }
};

  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleOwner, setVehicleOwner] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleBalance, setVehicleBalance] = useState("");

  const loginUser = () => {
    const foundUser = admins.find(
      (admin) =>
        admin.email === email &&
        admin.password === password
    );

    if (!foundUser) {
      alert("Invalid Credentials");
      return;
    }

    const updatedAdmins = admins.map((admin) => {
      if (admin.email === foundUser.email) {
        return {
          ...admin,
          status: "Active",
        };
      }

      return admin;
    });

    setAdmins(updatedAdmins);

    const updatedCurrentUser =
      updatedAdmins.find(
        (admin) =>
          admin.email === foundUser.email
      );

    setCurrentUser(updatedCurrentUser);

    setIsLoggedIn(true);
    localStorage.setItem(
      "loggedInUser",
      JSON.stringify(updatedCurrentUser)
    );

    setEmail("");
    setPassword("");
  };

  const logoutUser = () => {
    const updatedAdmins = admins.map((admin) => {
      if (
        admin.email === currentUser.email
      ) {
        return {
          ...admin,
          status: "Inactive",
        };
      }

      return admin;
      
    });

    setAdmins(updatedAdmins);

    localStorage.removeItem(
        "loggedInUser"
      );
      
    setCurrentUser(null);
    setIsLoggedIn(false);
    setActiveMenu("Dashboard");
  };

  const addVehicle = async () => {

  if (
    !vehicleNumber ||
    !vehicleOwner ||
    !vehicleType ||
    !vehicleBalance
  ) {
    alert("Fill all fields");
    return;
  }

  const newVehicle = {
    number: vehicleNumber,
    owner: vehicleOwner,
    type: vehicleType,
    balance: Number(vehicleBalance),
  };

  try {

    await axios.post(
      "http://localhost:5000/vehicles",
      newVehicle
    );

    fetchVehicles();

    setVehicleNumber("");
    setVehicleOwner("");
    setVehicleType("");
    setVehicleBalance("");

  } catch (error) {
    console.log(error);
  }
};

  const deleteVehicle = async (id) => {

  try {

    await axios.delete(
      `http://localhost:5000/vehicles/${id}`
    );

    fetchVehicles();

  } catch (error) {
    console.log(error);
  }
};

  const totalBalance = vehicleList.reduce(
    (total, vehicle) =>
      total + vehicle.balance,
    0
  );

  return (
    <div
      className={`min-h-screen p-8 transition-all duration-500 ${
        darkMode
          ? "bg-slate-950 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-6xl font-extrabold">
          <span className="text-green-500">
            TollSync
          </span>{" "}
          – Smart Toll Road Management
          System
        </h1>

        <p
          className={`text-2xl mt-4 font-semibold ${
            darkMode
              ? "text-gray-300"
              : "text-gray-500"
          }`}
        >
          Full Stack Web Application
        </p>
      </div>

      {!isLoggedIn ? (
        /* LOGIN */
        <div className="max-w-2xl mx-auto">
          <div
            className={`rounded-[35px] shadow-2xl p-10 border ${
              darkMode
                ? "bg-slate-900 border-slate-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h2 className="text-6xl font-extrabold text-green-500 text-center mb-10">
              TollSync Login
            </h2>

            {/* DEMO */}
            <div
              className={`rounded-3xl p-8 mb-8 border ${
                darkMode
                  ? "bg-slate-800 border-slate-700"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <p className="text-3xl font-extrabold text-blue-500 mb-6">
                Demo Admin Logins
              </p>

              <div className="space-y-6">
                {admins.map((admin, index) => (
                  <div key={index}>
                    <p className="text-2xl font-extrabold text-blue-500">
                      {admin.name} — {admin.role}
                    </p>

                    <p
                      className={`text-lg mt-2 font-semibold ${
                        darkMode
                          ? "text-gray-100"
                          : "text-gray-700"
                      }`}
                    >
                      Email: {admin.email}
                    </p>

                    <p
                      className={`text-lg font-semibold ${
                        darkMode
                          ? "text-gray-100"
                          : "text-gray-700"
                      }`}
                    >
                      Password: {admin.password}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* INPUTS */}
            <div className="space-y-6">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className={`w-full border rounded-2xl p-5 text-xl font-semibold ${
                  darkMode
                    ? "bg-slate-800 border-slate-600 text-white placeholder:text-gray-400"
                    : "bg-white border-gray-300 text-black"
                }`}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className={`w-full border rounded-2xl p-5 text-xl font-semibold ${
                  darkMode
                    ? "bg-slate-800 border-slate-600 text-white placeholder:text-gray-400"
                    : "bg-white border-gray-300 text-black"
                }`}
              />

              <button
                onClick={loginUser}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-5 rounded-2xl text-2xl font-extrabold"
              >
                Login
              </button>

              <button
                onClick={() =>
                  setDarkMode(!darkMode)
                }
                className="w-full bg-slate-900 text-white py-5 rounded-2xl text-2xl font-extrabold"
              >
                {darkMode
                  ? "Light Mode"
                  : "Dark Mode"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* APP */
        <div className="max-w-[1700px] mx-auto grid grid-cols-[300px_1fr] gap-6">
          {/* SIDEBAR */}
          <div className="bg-gradient-to-b from-slate-950 to-blue-950 rounded-[35px] shadow-2xl p-8 text-white min-h-[950px]">
            <h2 className="text-5xl font-extrabold text-green-400 mb-6">
              TollSync
            </h2>

            <div className="mb-10">
              <p className="text-3xl font-extrabold">
                {currentUser?.name}
              </p>

              <p className="text-green-400 text-xl font-bold mt-2">
                {currentUser?.role}
              </p>
            </div>

            <div className="space-y-5">
              {(
                currentUser?.role === "Super Admin"
                    ? [
                        "Dashboard",
                        "Vehicles",
                        "Transactions",
                        "Toll Plazas",
                        "Users",
                        "Reports",
                        "Settings",
                      ]
                    : currentUser?.role === "Toll Manager"
                    ? [
                        "Dashboard",
                        "Vehicles",
                        "Transactions",
                        "Toll Plazas",
                        "Reports",
                      ]
                    : [
                        "Dashboard",
                        "Vehicles",
                        "Transactions",
                      ]
                ).map((item) => (
                <div
                  key={item}
                  onClick={() =>
                    setActiveMenu(item)
                  }
                  className={`p-5 rounded-2xl cursor-pointer text-2xl font-extrabold transition-all ${
                    activeMenu === item
                      ? "bg-green-600"
                      : "hover:bg-slate-800"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>

            <button
              onClick={logoutUser}
              className="w-full mt-10 bg-red-500 hover:bg-red-600 text-white py-5 rounded-2xl text-2xl font-extrabold"
            >
              Logout
            </button>
          </div>

          {/* CONTENT */}
          <div
            className={`rounded-[35px] shadow-2xl border p-8 min-h-[950px] ${
              darkMode
                ? "bg-slate-900 border-slate-700"
                : "bg-white border-gray-200"
            }`}
          >
            {/* DASHBOARD */}
            {activeMenu === "Dashboard" && (
              <>
                <h2 className="text-6xl font-extrabold mb-8">
                  Dashboard
                </h2>

                <div className="grid grid-cols-4 gap-6 mb-8">
                  {[
                    {
                      title: "Revenue",
                      value: `₹ ${totalBalance}`,
                    },
                    {
                      title: "Vehicles",
                      value:
                        vehicleList.length,
                    },
                    {
                      title: "Transactions",
                      value:
                        vehicleList.length *
                        234,
                    },
                    {
                      title: "Toll Plazas",
                      value: 12,
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`rounded-3xl p-6 border shadow-md ${
                        darkMode
                          ? "bg-slate-800 border-slate-700"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <p className="text-2xl font-bold">
                        {item.title}
                      </p>

                      <h3 className="text-5xl font-extrabold text-green-500 mt-4">
                        {item.value}
                      </h3>
                    </div>
                  ))}
                </div>

                {/* GRAPH */}
                <div className="grid grid-cols-2 gap-6">
                  <div
                    className={`rounded-3xl p-8 border shadow-md ${
                      darkMode
                        ? "bg-slate-800 border-slate-700"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <h3 className="text-4xl font-extrabold mb-8">
                      Revenue Overview
                    </h3>

                    <div className="h-[400px] flex items-end gap-5">
                      {vehicleList.map(
                        (vehicle) => (
                          <div
                            key={
                              vehicle.number
                            }
                            className="flex-1 flex flex-col items-center gap-4"
                          >
                            <div
                              className="w-full bg-gradient-to-t from-green-600 to-green-300 rounded-t-3xl"
                              style={{
                                height: `${Math.min(
                                  vehicle.balance /
                                    2,
                                  320
                                )}px`,
                              }}
                            ></div>

                            <p className="font-bold">
                              {vehicle.number.slice(
                                0,
                                4
                              )}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* PIE */}
                  <div
                    className={`rounded-3xl p-8 border shadow-md flex flex-col items-center ${
                      darkMode
                        ? "bg-slate-800 border-slate-700"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <h3 className="text-4xl font-extrabold self-start mb-8">
                      FASTag Analytics
                    </h3>

                    <div className="relative w-[260px] h-[260px]">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 via-blue-500 to-yellow-400"></div>

                      <div
                        className={`absolute inset-[45px] rounded-full ${
                          darkMode
                            ? "bg-slate-800"
                            : "bg-white"
                        }`}
                      ></div>
                    </div>

                    <p className="text-5xl font-extrabold text-green-500 mt-8">
                      ₹ {totalBalance}
                    </p>

                    <p className="text-2xl font-bold mt-4">
                      Vehicles Registered:{" "}
                      {
                        vehicleList.length
                      }
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* VEHICLES */}
            {activeMenu === "Vehicles" && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-6xl font-extrabold">
                    Vehicle Management
                  </h2>

                  <button
                    onClick={addVehicle}
                    className="bg-green-600 text-white px-8 py-5 rounded-2xl text-2xl font-extrabold"
                  >
                    + Add Vehicle
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-8">
                  <input
                    type="text"
                    placeholder="Vehicle Number"
                    value={
                      vehicleNumber
                    }
                    onChange={(e) =>
                      setVehicleNumber(
                        e.target.value
                      )
                    }
                    className="border rounded-2xl p-5 text-xl font-bold"
                  />

                  <input
                    type="text"
                    placeholder="Owner Name"
                    value={
                      vehicleOwner
                    }
                    onChange={(e) =>
                      setVehicleOwner(
                        e.target.value
                      )
                    }
                    className="border rounded-2xl p-5 text-xl font-bold"
                  />

                  <input
                    type="text"
                    placeholder="Vehicle Type"
                    value={
                      vehicleType
                    }
                    onChange={(e) =>
                      setVehicleType(
                        e.target.value
                      )
                    }
                    className="border rounded-2xl p-5 text-xl font-bold"
                  />

                  <input
                    type="number"
                    placeholder="Balance"
                    value={
                      vehicleBalance
                    }
                    onChange={(e) =>
                      setVehicleBalance(
                        e.target.value
                      )
                    }
                    className="border rounded-2xl p-5 text-xl font-bold"
                  />
                </div>

                <div className="space-y-5">
                  {vehicleList.map(
                    (
                      vehicle,
                      index
                    ) => (
                      <div
                        key={index}
                        className={`rounded-3xl p-6 border shadow-md flex justify-between items-center ${
                          darkMode
                            ? "bg-slate-800 border-slate-700"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <div>
                          <p className="text-3xl font-extrabold">
                            {
                              vehicle.number
                            }
                          </p>

                          <p className="text-xl font-bold mt-3">
                            {
                              vehicle.owner
                            }{" "}
                            •{" "}
                            {
                              vehicle.type
                            }
                          </p>
                        </div>

                        <div className="flex items-center gap-5">
                          <p className="text-4xl font-extrabold text-green-500">
                            ₹{" "}
                            {
                              vehicle.balance
                            }
                          </p>

                          <button
                            onClick={() =>
                              deleteVehicle(
                                vehicle._id
                              )
                            }
                            className="bg-red-500 text-white px-5 py-3 rounded-xl text-xl font-extrabold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* TRANSACTIONS */}
            {activeMenu ===
              "Transactions" && (
              <div>
                <h2 className="text-6xl font-extrabold mb-8">
                  Transactions
                </h2>

                <div className="space-y-5">
                  {vehicleList.map(
                    (
                      vehicle,
                      index
                    ) => (
                      <div
                        key={index}
                        className={`rounded-3xl p-6 border shadow-md flex justify-between ${
                          darkMode
                            ? "bg-slate-800 border-slate-700"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <div>
                          <p className="text-3xl font-extrabold">
                            {
                              vehicle.number
                            }
                          </p>

                          <p className="text-xl font-bold mt-3">
                            FASTag
                            Recharge
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-4xl font-extrabold text-green-500">
                            ₹{" "}
                            {
                              vehicle.balance
                            }
                          </p>

                          <p className="text-xl font-bold text-blue-500 mt-3">
                            Success
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* TOLL PLAZAS */}
            {activeMenu ===
              "Toll Plazas" && (
              <div>
                <h2 className="text-6xl font-extrabold mb-8">
                  Toll Plazas
                </h2>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    {
                      name: "Mumbai Expressway",
                      vehicles: 342,
                      status:
                        "Operational",
                    },
                    {
                      name: "Pune Highway",
                      vehicles: 280,
                      status:
                        "Operational",
                    },
                    {
                      name: "Thane Creek",
                      vehicles: 120,
                      status:
                        "Maintenance",
                    },
                    {
                      name: "Ahmedabad Highway",
                      vehicles: 420,
                      status:
                        "Operational",
                    },
                  ].map(
                    (
                      plaza,
                      index
                    ) => (
                      <div
                        key={index}
                        className={`rounded-3xl p-8 border shadow-md ${
                          darkMode
                            ? "bg-slate-800 border-slate-700"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <h3 className="text-4xl font-extrabold">
                          {
                            plaza.name
                          }
                        </h3>

                        <p className="text-2xl font-bold mt-6">
                          Vehicles
                          Today:
                          <span className="text-green-500 ml-3">
                            {
                              plaza.vehicles
                            }
                          </span>
                        </p>

                        <div
                          className={`mt-6 inline-block px-5 py-3 rounded-2xl text-xl font-extrabold ${
                            plaza.status ===
                            "Operational"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {
                            plaza.status
                          }
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* USERS */}
            {activeMenu ===
              "Users" && (
              <div>
                <h2 className="text-6xl font-extrabold mb-8">
                  Users
                </h2>

                <div className="space-y-5">
                  {admins.map(
                    (
                      admin,
                      index
                    ) => (
                      <div
                        key={index}
                        className={`rounded-3xl p-6 border shadow-md flex justify-between items-center ${
                          darkMode
                            ? "bg-slate-800 border-slate-700"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <div>
                          <p className="text-3xl font-extrabold">
                            {
                              admin.name
                            }
                          </p>

                          <p className="text-xl font-bold mt-3">
                            {
                              admin.role
                            }
                          </p>
                        </div>

                        <div
                          className={`px-5 py-3 rounded-2xl text-xl font-extrabold ${
                            admin.status ===
                            "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {
                            admin.status
                          }
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* REPORTS */}
            {activeMenu ===
              "Reports" && (
              <div>
                <h2 className="text-6xl font-extrabold mb-8">
                  Reports &
                  Analytics
                </h2>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    {
                      title:
                        "Revenue Generated",
                      value: `₹ ${totalBalance}`,
                    },
                    {
                      title:
                        "Vehicles Registered",
                      value:
                        vehicleList.length,
                    },
                    {
                      title:
                        "Transactions",
                      value:
                        vehicleList.length *
                        234,
                    },
                    {
                      title:
                        "Operational Toll Plazas",
                      value: 12,
                    },
                  ].map(
                    (
                      report,
                      index
                    ) => (
                      <div
                        key={index}
                        className={`rounded-3xl p-8 border shadow-md ${
                          darkMode
                            ? "bg-slate-800 border-slate-700"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <p className="text-2xl font-bold">
                          {
                            report.title
                          }
                        </p>

                        <h3 className="text-6xl font-extrabold text-green-500 mt-6">
                          {
                            report.value
                          }
                        </h3>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* SETTINGS */}
            {activeMenu ===
              "Settings" && (
              <div>
                <h2 className="text-6xl font-extrabold mb-8">
                  Settings
                </h2>

                <div className="space-y-5">
                  <div
                    className={`rounded-3xl p-8 border shadow-md flex justify-between items-center ${
                      darkMode
                        ? "bg-slate-800 border-slate-700"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <p className="text-3xl font-extrabold">
                      Enable Dark
                      Mode
                    </p>

                    <button
                      onClick={() =>
                        setDarkMode(
                          !darkMode
                        )
                      }
                      className="bg-slate-900 text-white px-6 py-4 rounded-2xl text-xl font-extrabold"
                    >
                      {darkMode
                        ? "Light Mode"
                        : "Dark Mode"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// vehicle: DL8CAF2201 
// Name: Arjun Sharma
// Vehicle Type: Truck
// Amount: ₹3200