import { getCurrentUser, updateProfile } from "@/Services/user";
import { useEffect, useState } from "react";
import { ErrorFlash, SuccessFlash } from "@/Components/UI/FlashMessages";

export default function Form() {
  const [flash, setFlash] = useState({
    show: false,
    type: "",
    message: "",
  });
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
    imdBand: "",
    ageBand: "",
    studiedCredits: 0,
    numOfPrevAttempts: 0,
    disability: "",
  });

  const handleGetInfo = async () => {
    try {
      const result = await getCurrentUser();
      if (!result) {
        setFlash({
          show: true,
          type: "error",
          message: "something went wrong",
        });
      }
      const { data, success } = result;
      if (success) {
        setForm({
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          email: data.email ?? "",
          emailVerified: data.emailVerified ?? true,
          role: data.role ?? "",
          studentId: data.studentId ?? 0,
          gender: data.gender ?? "",
          highestEducation: data.highestEducation ?? "",
          region: data.region ?? "",
          imdBand: data.imdBand ?? "",
          ageBand: data.ageBand ?? "",
          studiedCredits: data.studiedCredits ?? 0,
          numOfPrevAttempts: data.numOfPrevAttempts ?? 0,
          disability: data.disability ?? "",
        });
      }
    } catch (error) {
      setFlash({
        type: "error",
        message: "something went wrong",
        show: true,
      });
    }
  };

  const handleUpdateProfile = async () => {
    const profileData = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      gender: form.gender.toUpperCase(),
      highestEducation: form.highestEducation,
      ageBand: String(form.ageBand),
      region: form.region,
      imdBand: String(form.imdBand),
      studiedCredits: Number(form.studiedCredits),
      numOfPrevAttempts: Number(form.numOfPrevAttempts),
      disability: form.disability,
    };

    try {
      const result = await updateProfile(profileData);
      if (result.success) {
        await handleGetInfo();
        setFlash({
          type: "success",
          message: "updated successfully",
          show: true,
        });
      } else {
        setFlash({
          type: "error",
          show: true,
          message: "Update Failed",
        });
      }
    } catch (error) {
      setFlash({
        type: "error",
        show: true,
        message: `update error ${error}`,
      });
    }
  };

  useEffect(() => {
    handleGetInfo();
  }, []);

  // flash messages
  useEffect(() => {
    if (!flash.show) return;
    const timer = setTimeout(() => {
      setFlash((prev) => ({
        ...prev,
        show: false,
      }));
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [flash.show]);

  // Shared classes so every input/select lines up and matches width
  const fieldWrapClass = "flex flex-col gap-2 w-full";
  const labelClass = "text-xl text-sky-900";
  const inputClass = "w-full bg-sky-600/10 text-black p-2.5 rounded-md";

  return (
    <>
    {flash.show && (flash.type==="error" ? (
      <ErrorFlash content={flash.message} />
    ): (<SuccessFlash content={flash.message}/>)
  )}
      <section className="mt-4 bg-white/90 shadow-2xl shadow-sky-900/10 rounded-3xl backdrop-blur p-6 pt-10 ">
        <div className="flex flex-col gap-10">
          {/*  first name, last name  */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className={fieldWrapClass}>
              <label htmlFor="firstName" className={labelClass}>
                First Name
              </label>
              <input
                id="firstName"
                value={form.firstName || ""}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                type="text"
                placeholder="First Name"
                className={inputClass}
              />
            </div>
            <div className={fieldWrapClass}>
              <label htmlFor="lastName" className={labelClass}>
                Last Name
              </label>
              <input
                id="lastName"
                value={form.lastName || ""}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                type="text"
                placeholder="Last Name"
                className={inputClass}
              />
            </div>
          </div>
          {/*  email, role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className={fieldWrapClass}>
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                id="email"
                type="text"
                value={form.email || ""}
                className={inputClass}
                disabled
              />
            </div>
            <div className={fieldWrapClass}>
              <label htmlFor="role" className={labelClass}>
                Role
              </label>
              <input
                id="role"
                disabled={true}
                value={form.role || ""}
                type="text"
                className={inputClass}
              />
            </div>
          </div>
          {/*  gender, studentID  */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className={fieldWrapClass}>
              <label htmlFor="gender" className={labelClass}>
                Gender
              </label>
              <select
                id="gender"
                value={form.gender || ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    gender: e.target.value,
                  }))
                }
                className={inputClass}
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
            <div className={fieldWrapClass}>
              <label htmlFor="studentId" className={labelClass}>
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
                className={inputClass}
              />
            </div>
          </div>
          {/*  region , imd band  */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className={fieldWrapClass}>
              <label htmlFor="region" className={labelClass}>
                Region
              </label>
              <input
                id="region"
                type="text"
                value={form.region || ""}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                placeholder="Region"
                className={inputClass}
              />
            </div>
            <div className={fieldWrapClass}>
              <label htmlFor="imdBand" className={labelClass}>
                IMD Band
              </label>
              <input
                id="imdBand"
                value={form.imdBand || ""}
                onChange={(e) => setForm({ ...form, imdBand: e.target.value })}
                type="text"
                placeholder="IMD Band"
                className={inputClass}
              />
            </div>
          </div>
          {/*  age band, highest education  */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className={fieldWrapClass}>
              <label htmlFor="ageBand" className={labelClass}>
                Age Band
              </label>
              <input
                id="ageBand"
                value={form.ageBand || ""}
                onChange={(e) => setForm({ ...form, ageBand: e.target.value })}
                type="text"
                placeholder="Age Band"
                className={inputClass}
              />
            </div>
            <div className={fieldWrapClass}>
              <label htmlFor="highestEducation" className={labelClass}>
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
                className={inputClass}
              />
            </div>
          </div>
          {/*  studiedCredits, numOfPrevAttempts  */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className={fieldWrapClass}>
              <label htmlFor="studiedCredits" className={labelClass}>
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
                className={inputClass}
              />
            </div>
            <div className={fieldWrapClass}>
              <label htmlFor="numOfPrevAttempts" className={labelClass}>
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
                className={inputClass}
              />
            </div>
          </div>
          {/*  disability, final result  */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className={fieldWrapClass}>
              <label htmlFor="disability" className={labelClass}>
                Disability
              </label>
              <input
                id="disability"
                type="text"
                value={form.disability || ""}
                onChange={(e) =>
                  setForm({ ...form, disability: e.target.value })
                }
                placeholder="Disability"
                className={inputClass}
              />
            </div>
          </div>

          <button
            onClick={handleUpdateProfile}
            className="bg-sky-950 font-bold hover:bg-sky-800 duration-700 text-sky-50  w-[50%] md:w-[20%] mt-10 p-2 rounded-xl cursor-pointer"
          >
            Update Profile
          </button>
        </div>
      </section>
    </>
  );
}
