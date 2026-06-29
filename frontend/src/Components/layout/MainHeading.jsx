
const MainHeading = ({ title, description }) => {
  return (
    <div className="flex flex-col items-start gap-2 mb-10 ">
      <h1 className="text-heading font-bold text-slate-dark">{title}</h1>
      <p className="text-body text-slate-medium max-w-[350px] mt-2">
        {description}
      </p>
    </div>
  );
};

export default MainHeading;
