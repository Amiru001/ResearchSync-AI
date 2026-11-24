import { useEffect, useState } from "react";
import {
  Pencil,
  Check,
  X,
} from "lucide-react";

const ProposalHeader = ({
  proposal,
  onSave,
}) => {

  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState(
    proposal?.title || ""
  );

  const [saving, setSaving] = useState(false);

  // Keep title synchronized when proposal changes
  useEffect(() => {

    setTitle(
      proposal?.title || ""
    );

  }, [proposal?.title]);


  // ============================================================
  // SAVE TITLE
  // ============================================================

  const handleSave = async () => {

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    try {

      setSaving(true);

      // Send title to parent
      await onSave({
        title: trimmedTitle,
      });

      setEditing(false);

    } catch (error) {

      console.error(
        "Failed to save research title:",
        error
      );

    } finally {

      setSaving(false);

    }

  };


  // ============================================================
  // CANCEL
  // ============================================================

  const handleCancel = () => {

    setTitle(
      proposal?.title || ""
    );

    setEditing(false);

  };


  return (

    <div className="flex items-center justify-between">

      {/* ================================================== */}
      {/* LEFT */}
      {/* ================================================== */}

      <div className="flex items-center gap-3">

        {editing ? (

          <>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              disabled={saving}
              autoFocus
              className="
                w-[700px]
                bg-transparent
                border-b-2
                border-purple-500
                text-[36px]
                font-bold
                text-white
                outline-none
                pb-1
              "
            />


            {/* SAVE */}

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="
                w-10
                h-10
                rounded-lg
                bg-green-500/10
                hover:bg-green-500/20
                transition-all
                duration-300
                flex
                items-center
                justify-center
                cursor-pointer
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >

              <Check
                size={18}
                className="text-green-400"
              />

            </button>


            {/* CANCEL */}

            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="
                w-10
                h-10
                rounded-lg
                bg-red-500/10
                hover:bg-red-500/20
                transition-all
                duration-300
                flex
                items-center
                justify-center
                cursor-pointer
                disabled:opacity-50
              "
            >

              <X
                size={18}
                className="text-red-400"
              />

            </button>

          </>

        ) : (

          <>

            <h1
              className="
                text-[36px]
                font-bold
                text-white
              "
            >
              {proposal?.title || "Untitled Research"}
            </h1>


            {/* EDIT */}

            <button
              type="button"
              onClick={() => setEditing(true)}
              title="Edit Research Title"
              className="
                w-9
                h-9
                rounded-lg
                border
                border-purple-500/30
                bg-purple-500/10
                hover:bg-purple-500/20
                transition-all
                duration-300
                flex
                items-center
                justify-center
                cursor-pointer
              "
            >

              <Pencil
                size={16}
                className="text-purple-300"
              />

            </button>

          </>

        )}

      </div>

    </div>

  );

};

export default ProposalHeader;