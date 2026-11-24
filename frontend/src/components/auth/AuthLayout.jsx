import AuthLeftPanel from "./AuthLeftPanel";

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#080C18]">

      {/* Grid Background */}

      <div
        className="
        absolute inset-0 opacity-40
        bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)]
        bg-[size:46px_46px]
        "
      />

      {/* Blue Glow */}

      <div className="absolute top-0 right-0 w-[700px] h-[400px] bg-blue-600/20 blur-[180px]" />

      {/* Purple Glow */}

      <div className="absolute bottom-0 left-0 w-[600px] h-[350px] bg-violet-600/10 blur-[180px]" />

      {/* Main Container */}

      <div className="relative min-h-screen flex">

        {/* Left Side */}

        <AuthLeftPanel />

        {/* Right Side */}

        <div
          className="
          w-full
          lg:w-[55%]
          flex
          items-center
          justify-center
          px-8
          py-16
          "
        >

          <div
            data-aos="zoom-in"
            className="
            w-full
            max-w-lg
            bg-white/5
            backdrop-blur-xl
            border
            border-white/10
            rounded-3xl
            p-10
            shadow-2xl
            "
          >

            {/* Heading */}

            <div className="text-center">

              <h1 className="text-4xl font-bold text-white">
                {title}
              </h1>

              <p className="text-gray-400 mt-4">
                {subtitle}
              </p>

            </div>

            {/* Form */}

            <div className="mt-10">

              {children}

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default AuthLayout;