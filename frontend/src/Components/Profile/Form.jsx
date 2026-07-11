import { getCurrentUser, updateProfile } from "@/Services/user";
import { useEffect, useState } from "react";

export default function Form() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    emailVerified: true,
    role: "",
    studentId: 0,
    gender: "",
    highestEducation: "",
    region: "",
    imdBand: 0,
    ageBand: 0,
    studiedCredits: 0,
    numOfPrevAttempts: 0,
    disability: "",
    finalResult: "",
  });

  const handleGetInfo = async () => {
    try {
      const { data, success } = await getCurrentUser();
      if (success) {
        setForm((prev) => ({
          ...prev,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role,
          studentId: data.studentId,
          gender: data.gender,
          highestEducation: data.highestEducation,
          region: data.region,
          imdBand: data.imdBand,
          ageBand: data.ageBand,
          studiedCredits: data.studiedCredits,
          numOfPrevAttempts: data.numOfPrevAttempts,
          disability: data.disability,
          finalResult: data.finalResult,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { success } = await updateProfile(form);
      if (success) {
        await handleGetInfo();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetInfo();
  }, []);

  return (
    <section className="mt-4 bg-white/90 shadow-2xl shadow-sky-900/10 rounded-3xl backdrop-blur p-6 pt-10 ">
      <div className="flex flex-col gap-10">
        {/*  first name, last name  */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="relative ">
            <label htmlFor="firstName" className="text-xl text-sky-900 mr-2">
              First Name
            </label>
            <input
              id="firstName"
              value={form.firstName || ""}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              type="text"
              placeholder="First Name"
              className="input-mobile"
            />
          </div>
          <div className="relative">
            <label htmlFor="lastName" className="text-xl text-sky-900 mr-2">
              Last Name
            </label>
            <input
              id="lastName"
              value={form.lastName || ""}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              type="text"
              placeholder="Last Name"
              className="input-mobile"
            />
          </div>
        </div>
        {/*  email, role */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="relative">
            <label htmlFor="email" className="text-xl text-sky-900 mr-2">
              Email
            </label>
            <input
              id="email"
              type="text"
              value={form.email || ""}
              className="input-mobile w-[50%]"
              disabled
            />
          </div>
          <div className="relative">
            <label htmlFor="role" className="text-xl text-sky-900 mr-2">
              Role
            </label>
            <input
              id="role"
              disabled={true}
              value={form.role || ""}
              type="text"
              className="input-mobile"
            />
          </div>
        </div>
        {/*  gender, studentID  */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="relative">
            <label htmlFor="gender" className="text-xl text-sky-900 mr-2">
              Gender
            </label>
            <select
              value={form.gender || ""}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              id="gender"
              className="select"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="relative">
            <label htmlFor="studentId" className="text-xl text-sky-900 mr-2">
              Student ID
            </label>
            <input
              id="studentId"
              disabled={true}
              value={form.studentId || ""}
              onChange={(e) =>
                setForm({ ...form, studentId: Number(e.target.value) })
              }
              type="text"
              placeholder="Student ID"
              className="input-mobile"
            />
          </div>
        </div>
        {/*  region , imd band  */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="relative">
            <label htmlFor="region" className="text-xl text-sky-900 mr-2">
              Region
            </label>
            <input
              id="region"
              type="text"
              value={form.region || ""}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
              placeholder="Region"
              className="input-mobile"
            />
          </div>
          <div className="relative">
            <label htmlFor="imdBand" className="text-xl text-sky-900 mr-2">
              IMD Band
            </label>
            <input
              id="imdBand"
              value={form.imdBand || ""}
              onChange={(e) => setForm({ ...form, imdBand: e.target.value })}
              type="text"
              placeholder="IMD Band"
              className="input-mobile"
            />
          </div>
        </div>
        {/*  age band, highest education  */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="relative">
            <label htmlFor="ageBand" className="text-xl text-sky-900 mr-2">
              Age Band
            </label>
            <input
              id="ageBand"
              value={form.ageBand || ""}
              onChange={(e) => setForm({ ...form, ageBand: e.target.value })}
              type="text"
              placeholder="Age Band"
              className="input-mobile"
            />
          </div>
          <div className="relative">
            <label
              htmlFor="highestEducation"
              className="text-xl text-sky-900 mr-2"
            >
              Highest Education
            </label>
            <input
              id="highestEducation"
              type="text"
              value={form.highestEducation || ""}
              onChange={(e) =>
                setForm({ ...form, highestEducation: e.target.value })
              }
              placeholder="Highest Education"
              className="input-mobile"
            />
          </div>
        </div>
        {/*  studiedCredits, numOfPrevAttempts  */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="relative">
            <label
              htmlFor="studiedCredits"
              className="text-xl text-sky-900 mr-2"
            >
              Studied Credits
            </label>
            <input
              id="studiedCredits"
              type="number"
              value={form.studiedCredits || ""}
              onChange={(e) =>
                setForm({ ...form, studiedCredits: Number(e.target.value) })
              }
              placeholder="Studied Credits"
              className="input-mobile"
            />
          </div>
          <div className="relative">
            <label
              htmlFor="numOfPrevAttempts"
              className="text-xl text-sky-900 mr-2 "
            >
              Number of Previous Attempts
            </label>
            <input
              id="numOfPrevAttempts"
              type="number"
              value={form.numOfPrevAttempts || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  numOfPrevAttempts: Number(e.target.value),
                })
              }
              placeholder="Number of Previous Attempts"
              className="input-mobile w-[50%]"
            />
          </div>
        </div>
        {/*  disability, final result  */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="relative">
            <label htmlFor="disability" className="text-xl text-sky-900 mr-2">
              Disability
            </label>
            <input
              id="disability"
              type="text"
              value={form.disability || ""}
              onChange={(e) => setForm({ ...form, disability: e.target.value })}
              placeholder="Disability"
              className="input-mobile"
            />
          </div>
          <div className="relative">
            <label htmlFor="finalResult" className="text-xl text-sky-900 mr-2">
              Final Result
            </label>
            <input
              id="finalResult"
              type="text"
              value={form.finalResult || ""}
              onChange={(e) =>
                setForm({ ...form, finalResult: e.target.value })
              }
              placeholder="Final Result"
              className="input-mobile"
            />
          </div>
        </div>

        <button
          onClick={handleUpdateProfile}
          className="bg-sky-950 font-bold hover:bg-sky-800 duration-700 text-sky-50  w-[50%] md:w-[10%] mt-10 p-2 rounded-xl cursor-pointer"
        >
          Update Profile
        </button>
      </div>
    </section>
  );
}
