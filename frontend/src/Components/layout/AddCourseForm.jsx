import { createCourse } from "@/Services/courses";
import { useState } from "react";

const AddCourseForm = ({onSuccess}) =>{
  const [formData, setFromData] = useState({
    codeModule: "",
    codePresentation: "",
    name: "",
    description: "",
    hours: "",
    skills: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFromData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const course = {
      codeModule: formData.codeModule,
      codePresentation: formData.codePresentation,
      name: formData.name,
      description: formData.description,
      hours: Number(formData.hours),
      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== ""),
    };
    try {
      await createCourse(course);
      if(onSuccess){
        await onSuccess();
      }
    } catch (error) {
      console.log("something went wrong")
    }
  };

  return (
    <form onSubmit={handleCreateCourse} className="h-[80vh] md:h-[75vh]  text-sky-950 font-bold space-y-2.5  px-5">
      <h2 className="text-xl md:text-2xl font-extrabold bg-linear-to-r from-sky-700 to-sky-950 bg-clip-text text-transparent">
        Add Course
      </h2>
      <input
        type="text"
        name="codeModule"
        placeholder="Course Module"
        value={formData.codeModule}
        onChange={handleChange}
        className="w-full rounded-lg border p-3"
      />

      <input
        type="text"
        name="codePresentation"
        placeholder="Course Presentation"
        value={formData.codePresentation}
        onChange={handleChange}
        className="w-full rounded-lg border p-3"
      />

      <input
        type="text"
        name="name"
        placeholder="Course Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full rounded-lg border p-3"
      />

      <textarea
        name="description"
        placeholder="Course Description"
        value={formData.description}
        onChange={handleChange}
        rows={5}
        className="w-full rounded-lg border p-3"
      />

      <input
        type="number"
        name="hours"
        placeholder="Hours"
        value={formData.hours}
        onChange={handleChange}
        className="w-full rounded-lg border p-3"
      />

      <input
        type="text"
        name="skills"
        placeholder="React, JavaScript, HTML"
        value={formData.skills}
        onChange={handleChange}
        className="w-full rounded-lg border p-3"
      />
      <button
        type="submit"
        className=" w-[50%] mt-10 md:mt-5 rounded-lg cursor-pointer hover:bg-green-700 transition-colors duration-700 bg-sky-900 py-3 text-white font-semibold"
      >
        Create Course
      </button>
    </form>
  );
}

export default AddCourseForm;
