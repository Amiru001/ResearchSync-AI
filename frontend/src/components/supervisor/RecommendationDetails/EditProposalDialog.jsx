import { useState } from "react";
import {
  X,
  FilePenLine,
  Plus,
  Trash2,
} from "lucide-react";

const EditProposalDialog = ({
  proposal,
  onClose,
  onSave,
}) => {

  const [description, setDescription] = useState(
    proposal.description
  );

  const [problemStatement, setProblemStatement] = useState(
    proposal.problemStatement
  );

  const [objectives, setObjectives] = useState(
    proposal.objectives
  );

  const updateObjective = (index, value) => {

    const updated = [...objectives];

    updated[index] = value;

    setObjectives(updated);

  };

  const removeObjective = (index) => {

    setObjectives(
      objectives.filter((_, i) => i !== index)
    );

  };

  const addObjective = () => {

    setObjectives([
      ...objectives,
      "",
    ]);

  };

  return (

    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-5">

      <div className="w-full max-w-4xl rounded-2xl bg-[#111827] border border-gray-700 max-h-[90vh] overflow-y-auto">

        {/* Header */}

        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-700">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-purple-600 flex items-center justify-center">

              <FilePenLine
                size={20}
                className="text-white"
              />

            </div>

            <div>

              <h2 className="text-xl font-semibold text-white">
                Edit Research Proposal
              </h2>

              <p className="text-gray-400 text-sm">
                Update proposal details after discussion.
              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            className="cursor-pointer"
          >

            <X className="text-gray-400 hover:text-white transition" />

          </button>

        </div>

        {/* Body */}

        <div className="p-7 space-y-7">

          {/* Description */}

          <div>

            <label className="block text-white font-medium mb-3">
              Research Description
            </label>

            <textarea
              rows={6}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full rounded-xl bg-[#1F2937] border border-gray-700 p-4 text-white resize-none outline-none focus:border-purple-500"
            />

          </div>

          {/* Problem */}

          <div>

            <label className="block text-white font-medium mb-3">
              Problem Statement
            </label>

            <textarea
              rows={5}
              value={problemStatement}
              onChange={(e) =>
                setProblemStatement(e.target.value)
              }
              className="w-full rounded-xl bg-[#1F2937] border border-gray-700 p-4 text-white resize-none outline-none focus:border-purple-500"
            />

          </div>

          {/* Objectives */}

          <div>

            <div className="flex justify-between items-center mb-4">

              <label className="text-white font-medium">
                Research Objectives
              </label>

              <button
                onClick={addObjective}
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition cursor-pointer"
              >

                <Plus size={18} />

                Add Objective

              </button>

            </div>

            <div className="space-y-3">

              {objectives.map((objective, index) => (

                <div
  key={index}
  className="flex items-center gap-3"
>
  <input
    type="text"
    value={objective}
    onChange={(e) => updateObjective(index, e.target.value)}
    className="flex-1 h-14 rounded-xl bg-[#232D3D] border border-gray-700 px-5 text-white outline-none focus:border-purple-500"
  />

  <button
    onClick={() => removeObjective(index)}
    className="w-14 h-14 flex items-center justify-center rounded-xl border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 transition-all duration-300 cursor-pointer flex-shrink-0"
  >
    <Trash2
      size={20}
      className="text-red-400"
    />
  </button>
</div>

              ))}

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 px-7 py-5 border-t border-gray-700">

          <button
            onClick={onClose}
            className="px-5 h-11 rounded-xl border border-gray-700 text-gray-300 hover:bg-[#1F2937] transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={() =>
              onSave({
                description,
                problemStatement,
                objectives,
              })
            }
            className="px-6 h-11 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:brightness-110 transition cursor-pointer"
          >
            Save Changes
          </button>

        </div>

      </div>

    </div>

  );

};

export default EditProposalDialog;