import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitResearch } from "../../services/api";

const ResearchIdeaForm = () => {
    const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({

    research_title: "",

    research_description: "",

    problem_statement: "",

    proposed_solution: "",

    research_objectives: "",

    keywords: "",

  });

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({

      ...prev,

      [name]: value,

    }));

  };

  const validateForm = () => {

    if (
      !formData.research_title.trim() ||
      !formData.research_description.trim() ||
      !formData.problem_statement.trim() ||
      !formData.proposed_solution.trim() ||
      !formData.research_objectives.trim() ||
      !formData.keywords.trim()
    ) {

      setError("Please fill in all fields.");

      return false;

    }

    if (formData.research_title.trim().length < 10) {

      setError("Research title must contain at least 10 characters.");

      return false;

    }

    if (formData.research_description.trim().length < 50) {

      setError("Research description must contain at least 50 characters.");

      return false;

    }

    if (formData.problem_statement.trim().length < 30) {

      setError("Problem statement must contain at least 30 characters.");

      return false;

    }

    if (formData.proposed_solution.trim().length < 30) {

      setError("Proposed solution must contain at least 30 characters.");

      return false;

    }

    if (formData.research_objectives.trim().length < 20) {

      setError("Research objectives must contain at least 20 characters.");

      return false;

    }

    const keywords = formData.keywords
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    if (keywords.length < 3) {

      setError("Please enter at least 3 keywords.");

      return false;

    }

    return true;

  };

  const handleSaveDraft = () => {

    setError("");

    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);

    setTimeout(() => {

      setLoading(false);

      setSuccess("Research idea saved as draft.");

    }, 1200);

  };

  const handleSubmit = async (e) => {

  e.preventDefault();

  setError("");
  setSuccess("");

  if (!validateForm()) return;

  setLoading(true);

  try {

    const response = await submitResearch({

      research_title: formData.research_title,

      research_description: formData.research_description,

      problem_statement: formData.problem_statement,

      proposed_solution: formData.proposed_solution,

      research_objectives: formData.research_objectives
  .split("\n")
  .map((item) => item.trim())
  .filter((item) => item !== ""),

      keywords: formData.keywords
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== ""),

    });

    if (response.status === 200) {

      setSuccess(response.data.message);

      setTimeout(() => {

        navigate("/student/results");

      }, 1500);

    } else {

      setError(
        response.data.detail ||
        response.data.message ||
        "Submission failed."
      );

    }

  } catch (err) {

    setError("Unable to connect to the server.");

  } finally {

    setLoading(false);

  }

};

  return (
    

    <div className="max-w-5xl mx-auto">

      {/* Heading */}

      <div className="mb-8">

        <h1 className="text-2xl font-bold text-white">

          Submit Research Idea

        </h1>

        <p className="text-gray-400 mt-1 text-sm">

          Provide your research details for AI analysis and supervisor recommendation.

        </p>

      </div>

      {/* Success */}

      {success && (

        <div className="mb-5 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl p-3">

          {success}

        </div>

      )}

      {/* Error */}

      {error && (

        <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3">

          {error}

        </div>

      )}

      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

                  {/* Research Title */}

          <div>

            <div className="flex justify-between mb-2">

              <label className="text-sm text-gray-300">
                Research Title
              </label>

              <span className="text-xs text-gray-500">
                {formData.research_title.length}/150
              </span>

            </div>

            <input
              type="text"
              name="research_title"
              value={formData.research_title}
              onChange={handleChange}
              maxLength={150}
              placeholder="Enter your research title"
              className="
                w-full
                bg-[#1F2937]
                border
                border-gray-700
                rounded-lg
                px-4
                py-3
                text-white
                outline-none
                focus:border-blue-500
              "
            />

          </div>

          {/* Research Description */}

          <div>

            <div className="flex justify-between mb-2">

              <label className="text-sm text-gray-300">
                Research Description
              </label>

              <span className="text-xs text-gray-500">
                {formData.research_description.length}/1000
              </span>

            </div>

            <textarea
              rows="5"
              name="research_description"
              value={formData.research_description}
              onChange={handleChange}
              maxLength={1000}
              placeholder="Describe your research idea..."
              className="
                w-full
                bg-[#1F2937]
                border
                border-gray-700
                rounded-lg
                px-4
                py-3
                text-white
                outline-none
                focus:border-blue-500
                resize-none
              "
            />

          </div>

          {/* Problem Statement */}

          <div>

            <div className="flex justify-between mb-2">

              <label className="text-sm text-gray-300">
                Problem Statement
              </label>

              <span className="text-xs text-gray-500">
                {formData.problem_statement.length}/800
              </span>

            </div>

            <textarea
              rows="4"
              name="problem_statement"
              value={formData.problem_statement}
              onChange={handleChange}
              maxLength={800}
              placeholder="Describe the problem your research solves..."
              className="
                w-full
                bg-[#1F2937]
                border
                border-gray-700
                rounded-lg
                px-4
                py-3
                text-white
                outline-none
                focus:border-blue-500
                resize-none
              "
            />

          </div>

                    {/* Proposed Solution */}

          <div>

            <div className="flex justify-between mb-2">

              <label className="text-sm text-gray-300">
                Proposed Solution
              </label>

              <span className="text-xs text-gray-500">
                {formData.proposed_solution.length}/800
              </span>

            </div>

            <textarea
              rows="4"
              name="proposed_solution"
              value={formData.proposed_solution}
              onChange={handleChange}
              maxLength={800}
              placeholder="Describe your proposed solution..."
              className="
                w-full
                bg-[#1F2937]
                border
                border-gray-700
                rounded-lg
                px-4
                py-3
                text-white
                outline-none
                focus:border-blue-500
                resize-none
              "
            />

          </div>

          {/* Research Objectives */}

          <div>

            <div className="flex justify-between mb-2">

              <label className="text-sm text-gray-300">
                Research Objectives
              </label>

              <span className="text-xs text-gray-500">
                {formData.research_objectives.length}/600
              </span>

            </div>

            <textarea
              rows="4"
              name="research_objectives"
              value={formData.research_objectives}
              onChange={handleChange}
              maxLength={600}
              placeholder="List your research objectives..."
              className="
                w-full
                bg-[#1F2937]
                border
                border-gray-700
                rounded-lg
                px-4
                py-3
                text-white
                outline-none
                focus:border-blue-500
                resize-none
              "
            />

          </div>

          {/* Keywords */}

          <div>

            <label className="block text-sm text-gray-300 mb-2">
              Keywords
            </label>

            <input
              type="text"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              placeholder="AI, Deep Learning, NLP, Healthcare"
              className="
                w-full
                bg-[#1F2937]
                border
                border-gray-700
                rounded-lg
                px-4
                py-3
                text-white
                outline-none
                focus:border-blue-500
              "
            />

            <p className="text-xs text-gray-500 mt-2">
              Separate keywords using commas.
            </p>

          </div>

          

          {/* Buttons */}

          <div className="flex justify-end gap-4 pt-2">

            <button
              type="button"
              className="
                px-6
                py-3
                rounded-lg
                border
                border-gray-600
                text-gray-300
                hover:bg-gray-700
                transition
              "
            >
              Save Draft
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                px-6
                py-3
                rounded-lg
                bg-blue-600
                hover:bg-blue-700
                text-white
                transition
                disabled:opacity-50
              "
            >
              {loading ? "Submitting..." : "Analyze & Submit"}
            </button>

          </div>

        </form>

      </div>

    </div>

    

  );

};

export default ResearchIdeaForm;