import { useState } from "react";

import {
  ShieldCheck,
  Search,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
  checkPlagiarism,
  searchExternalSources,
} from "../../services/plagiarismService";


const PlagiarismChecker = () => {

  // ============================================================
  // STATE
  // ============================================================

  const [text, setText] = useState("");

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  // ============================================================
  // ONLINE SCHOLARLY SEARCH STATE
  // ============================================================

  const [externalResult, setExternalResult] = useState(null);

  const [externalLoading, setExternalLoading] = useState(false);

  const [externalError, setExternalError] = useState("");

  // ============================================================
  // EXISTING ERROR STATE
  // ============================================================

  const [error, setError] = useState("");

  const [openSections, setOpenSections] = useState({});


  // ============================================================
  // CHECK PLAGIARISM
  // ============================================================

  const handleCheck = async () => {

    if (!text.trim()) {

      setError(
        "Please paste your research document before checking."
      );

      return;
    }


    if (text.trim().length < 100) {

      setError(
        "Please enter a longer document for plagiarism screening."
      );

      return;
    }


    try {

      setLoading(true);

      setError("");

      setResult(null);

      // Reset previous online result
      setExternalResult(null);

      setExternalError("");


      // ========================================================
      // EXISTING LOCAL PLAGIARISM CHECK
      // ========================================================

      const data = await checkPlagiarism(
        text
      );


      console.log(
        "Plagiarism result:",
        data
      );


      setResult(data);


      // ========================================================
      // ONLINE SCHOLARLY SEARCH
      // ========================================================

      try {

        setExternalLoading(true);

        setExternalError("");


        const externalData =
          await searchExternalSources(
            text
          );


        console.log(
          "External scholarly result:",
          externalData
        );


        setExternalResult(
          externalData
        );


      } catch (externalError) {

        console.error(
          "External scholarly search failed:",
          externalError
        );


        setExternalResult(null);


        setExternalError(
          externalError?.message ||
          "Unable to load external scholarly sources."
        );


      } finally {

        setExternalLoading(false);

      }


    } catch (error) {

      console.error(
        "Plagiarism check failed:",
        error
      );


      setError(
        error?.message ||
        "Unable to check plagiarism."
      );

    } finally {

      setLoading(false);

    }

  };


  // ============================================================
  // CLEAR
  // ============================================================

  const handleClear = () => {

    setText("");

    setResult(null);

    setExternalResult(null);

    setExternalError("");

    setError("");

    setOpenSections({});

  };


  // ============================================================
  // TOGGLE MATCHING SECTION
  // ============================================================

  const toggleSection = (index) => {

    setOpenSections(
      (previous) => ({
        ...previous,

        [index]:
          !previous[index],

      })
    );

  };


  // ============================================================
  // RISK STYLING
  // ============================================================

  const getRiskStyles = (risk) => {

    switch (risk) {

      case "High":

        return {

          container:
            "border-red-500/30 bg-red-500/10",

          icon:
            "bg-red-500/10 text-red-400",

          text:
            "text-red-400",

          badge:
            "bg-red-500/10 border-red-500/30 text-red-400",

        };


      case "Medium":

        return {

          container:
            "border-yellow-500/30 bg-yellow-500/10",

          icon:
            "bg-yellow-500/10 text-yellow-400",

          text:
            "text-yellow-400",

          badge:
            "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",

        };


      default:

        return {

          container:
            "border-green-500/30 bg-green-500/10",

          icon:
            "bg-green-500/10 text-green-400",

          text:
            "text-green-400",

          badge:
            "bg-green-500/10 border-green-500/30 text-green-400",

        };

    }

  };


  // ============================================================
  // PAGE
  // ============================================================

  return (

    <DashboardLayout>

      <div className="max-w-6xl mx-auto space-y-6">


        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div>

          <div className="flex items-center gap-3">

            <div className="
              w-11
              h-11
              rounded-xl
              bg-purple-500/10
              flex
              items-center
              justify-center
            ">

              <ShieldCheck
                size={23}
                className="text-purple-400"
              />

            </div>


            <div>

              <h1 className="
                text-3xl
                font-bold
                text-white
              ">
                Plagiarism Checker
              </h1>


              <p className="
                text-sm
                text-gray-400
                mt-1
              ">
                Check your research document for similarity with
                the available reference documents.
              </p>

            </div>

          </div>

        </div>


        {/* ================================================== */}
        {/* INPUT CARD */}
        {/* ================================================== */}

        <div className="
          bg-[#111827]
          border
          border-gray-600
          rounded-2xl
          p-6
        ">

          <div className="flex items-center justify-between mb-4">

            <div>

              <h2 className="
                text-lg
                font-semibold
                text-white
              ">
                Research Document
              </h2>


              <p className="
                text-xs
                text-gray-500
                mt-1
              ">
                Paste the text of your research document below.
              </p>

            </div>


            <span className="
              text-xs
              text-gray-500
            ">
              {text.length.toLocaleString()} characters
            </span>

          </div>


          <textarea
            value={text}
            onChange={(e) =>
              setText(e.target.value)
            }
            placeholder="Paste your research document here..."
            className="
              w-full
              min-h-[320px]
              resize-y
              rounded-xl
              bg-[#0B1220]
              border
              border-gray-700
              text-gray-200
              placeholder:text-gray-600
              p-5
              text-sm
              leading-6
              outline-none
              focus:border-purple-500
              transition
            "
          />


          {/* ERROR */}

          {error && (

            <div className="
              mt-4
              rounded-xl
              border
              border-red-500/30
              bg-red-500/10
              px-4
              py-3
              text-sm
              text-red-400
            ">

              {error}

            </div>

          )}


          {/* BUTTONS */}

          <div className="
            mt-5
            flex
            justify-end
            gap-3
          ">

            <button
              type="button"
              onClick={handleClear}
              className="
                px-5
                py-2.5
                rounded-lg
                border
                border-gray-700
                text-sm
                text-gray-300
                hover:bg-[#1F2937]
                transition
              "
            >
              Clear
            </button>


            <button
              type="button"
              onClick={handleCheck}
              disabled={loading}
              className="
                px-5
                py-2.5
                rounded-lg
                bg-gradient-to-r
                from-purple-600
                to-purple-500
                text-white
                text-sm
                font-medium
                flex
                items-center
                gap-2
                hover:from-purple-500
                hover:to-purple-400
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition
              "
            >

              {loading ? (

                <>

                  <Search
                    size={17}
                    className="animate-spin"
                  />

                  Checking...

                </>

              ) : (

                <>

                  <Search
                    size={17}
                  />

                  Check Similarity

                </>

              )}

            </button>

          </div>

        </div>


        {/* ================================================== */}
        {/* RESULT */}
        {/* ================================================== */}

        {result &&
          result.status === "Completed" && (

          <>


            {/* ============================================== */}
            {/* SUMMARY */}
            {/* ============================================== */}

            <div className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-4
            ">


              {/* SIMILARITY */}

              <div className="
                bg-[#111827]
                border
                border-gray-600
                rounded-2xl
                p-5
              ">

                <div className="flex items-center gap-3">

                  <div className="
                    w-10
                    h-10
                    rounded-lg
                    bg-purple-500/10
                    flex
                    items-center
                    justify-center
                  ">

                    <Search
                      size={19}
                      className="text-purple-400"
                    />

                  </div>


                  <div>

                    <p className="
                      text-xs
                      text-gray-400
                    ">
                      Similarity Score
                    </p>


                    <p className="
                      text-2xl
                      font-bold
                      text-white
                    ">
                      {result.similarity_percentage ?? 0}%
                    </p>

                  </div>

                </div>

              </div>


              {/* RISK */}

              <div className={`
                border
                rounded-2xl
                p-5
                ${
                  getRiskStyles(
                    result.risk_level
                  ).container
                }
              `}>

                <div className="flex items-center gap-3">

                  <div className={`
                    w-10
                    h-10
                    rounded-lg
                    flex
                    items-center
                    justify-center
                    ${
                      getRiskStyles(
                        result.risk_level
                      ).icon
                    }
                  `}>

                    {result.risk_level === "High" ? (

                      <AlertTriangle
                        size={20}
                      />

                    ) : (

                      <CheckCircle2
                        size={20}
                      />

                    )}

                  </div>


                  <div>

                    <p className="
                      text-xs
                      text-gray-400
                    ">
                      Risk Level
                    </p>


                    <p className={`
                      text-2xl
                      font-bold
                      ${
                        getRiskStyles(
                          result.risk_level
                        ).text
                      }
                    `}>
                      {result.risk_level || "Low"}
                    </p>

                  </div>

                </div>

              </div>


              {/* COVERAGE */}

              <div className="
                bg-[#111827]
                border
                border-gray-600
                rounded-2xl
                p-5
              ">

                <div className="flex items-center gap-3">

                  <div className="
                    w-10
                    h-10
                    rounded-lg
                    bg-blue-500/10
                    flex
                    items-center
                    justify-center
                  ">

                    <FileText
                      size={19}
                      className="text-blue-400"
                    />

                  </div>


                  <div>

                    <p className="
                      text-xs
                      text-gray-400
                    ">
                      Similar Content Coverage
                    </p>


                    <p className="
                      text-2xl
                      font-bold
                      text-white
                    ">
                      {result.similarity_coverage ?? 0}%
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* ============================================== */}
            {/* MESSAGE */}
            {/* ============================================== */}

            <div className={`
              rounded-2xl
              border
              p-5
              ${
                getRiskStyles(
                  result.risk_level
                ).container
              }
            `}>

              <p className="
                text-sm
                text-gray-200
                leading-6
              ">
                {result.message}
              </p>


              <p className="
                mt-2
                text-xs
                text-gray-500
              ">
                This result is a similarity indicator based on
                the available reference corpus and should be
                reviewed by an academic.
              </p>

            </div>


            {/* ============================================== */}
            {/* MATCHING DOCUMENTS */}
            {/* ============================================== */}

            <div className="
              bg-[#111827]
              border
              border-gray-600
              rounded-2xl
              p-6
            ">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="
                    text-lg
                    font-semibold
                    text-white
                  ">
                    Matching Reference Documents
                  </h2>


                  <p className="
                    text-xs
                    text-gray-500
                    mt-1
                  ">
                    Documents with the strongest similarity.
                  </p>

                </div>

              </div>


              <div className="mt-5 space-y-3">

                {result.matched_documents?.length > 0 ? (

                  result.matched_documents.map(
                    (document, index) => (

                    <div
                      key={`${document.filename}-${index}`}
                      className="
                        rounded-xl
                        bg-[#1F2937]
                        border
                        border-gray-700
                        p-4
                      "
                    >

                      <div className="
                        flex
                        items-center
                        justify-between
                        gap-4
                      ">

                        <div className="min-w-0">

                          <div className="
                            flex
                            items-center
                            gap-2
                          ">

                            <FileText
                              size={17}
                              className="text-purple-400"
                            />

                            <p className="
                              text-sm
                              font-medium
                              text-white
                              truncate
                            ">
                              {document.filename}
                            </p>

                          </div>


                          <p className="
                            mt-1
                            text-xs
                            text-gray-500
                          ">
                            {document.document_type}
                          </p>

                        </div>


                        <span className="
                          flex-shrink-0
                          text-sm
                          font-semibold
                          text-white
                        ">
                          {document.similarity}%
                        </span>

                      </div>

                    </div>

                  ))

                ) : (

                  <p className="
                    text-sm
                    text-gray-500
                  ">
                    No matching reference documents found.
                  </p>

                )}

              </div>

            </div>


            {/* ============================================== */}
            {/* EXTERNAL SCHOLARLY SOURCES */}
            {/* ============================================== */}

            <div className="
              bg-[#111827]
              border
              border-gray-600
              rounded-2xl
              p-6
            ">

              <div className="
                flex
                items-center
                justify-between
              ">

                <div>

                  <h2 className="
                    text-lg
                    font-semibold
                    text-white
                  ">
                    External Scholarly Sources
                  </h2>


                  <p className="
                    text-xs
                    text-gray-500
                    mt-1
                  ">
                    Potentially relevant open-access scholarly
                    sources found through online search.
                  </p>

                </div>


                {externalLoading && (

                  <span className="
                    text-xs
                    text-purple-400
                  ">
                    Searching...
                  </span>

                )}

              </div>


              {/* ================================================== */}
              {/* EXTERNAL LOADING */}
              {/* ================================================== */}

              {externalLoading && (

                <div className="
                  mt-5
                  rounded-xl
                  bg-[#1F2937]
                  border
                  border-gray-700
                  p-5
                  text-center
                ">

                  <Search
                    size={22}
                    className="
                      mx-auto
                      text-purple-400
                      animate-spin
                    "
                  />


                  <p className="
                    mt-3
                    text-sm
                    text-gray-400
                  ">
                    Searching scholarly sources...
                  </p>

                </div>

              )}


              {/* ================================================== */}
              {/* EXTERNAL ERROR */}
              {/* ================================================== */}

              {!externalLoading &&
                externalError && (

                <div className="
                  mt-5
                  rounded-xl
                  border
                  border-yellow-500/30
                  bg-yellow-500/10
                  p-4
                ">

                  <p className="
                    text-sm
                    text-yellow-400
                  ">
                    {externalError}
                  </p>

                </div>

              )}


              {/* ================================================== */}
              {/* EXTERNAL RESULTS */}
              {/* ================================================== */}

              {!externalLoading &&
                !externalError &&
                externalResult && (

                <>

                  {/* SUMMARY */}

                  <div className="
                    mt-5
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-4
                  ">

                    <div className="
                      rounded-xl
                      bg-[#1F2937]
                      border
                      border-gray-700
                      p-5
                    ">

                      <p className="
                        text-xs
                        text-gray-400
                      ">
                        External Scholarly Similarity
                      </p>


                      <p className="
                        mt-1
                        text-3xl
                        font-bold
                        text-white
                      ">
                        {
                          externalResult
                            .external_similarity ?? 0
                        }%
                      </p>

                    </div>


                    <div className="
                      rounded-xl
                      bg-[#1F2937]
                      border
                      border-gray-700
                      p-5
                    ">

                      <p className="
                        text-xs
                        text-gray-400
                      ">
                        Potential Sources Found
                      </p>


                      <p className="
                        mt-1
                        text-3xl
                        font-bold
                        text-white
                      ">
                        {
                          externalResult
                            .source_count ?? 0
                        }
                      </p>

                    </div>

                  </div>


                  {/* SOURCES */}

                  <div className="
                    mt-5
                    space-y-3
                  ">

                    {externalResult.sources?.length > 0 ? (

                      externalResult.sources.map(
                        (source, index) => (

                        <div
                          key={`${source.title}-${index}`}
                          className="
                            rounded-xl
                            bg-[#1F2937]
                            border
                            border-gray-700
                            p-4
                          "
                        >

                          <div className="
                            flex
                            items-start
                            justify-between
                            gap-4
                          ">

                            <div className="
                              min-w-0
                            ">

                              <div className="
                                flex
                                items-start
                                gap-2
                              ">

                                <FileText
                                  size={17}
                                  className="
                                    text-blue-400
                                    mt-0.5
                                    flex-shrink-0
                                  "
                                />


                                <div className="
                                  min-w-0
                                ">

                                  <p className="
                                    text-sm
                                    font-semibold
                                    text-white
                                  ">
                                    {source.title}
                                  </p>


                                  <p className="
                                    mt-1
                                    text-xs
                                    text-gray-500
                                  ">

                                    {
                                      source.year ||
                                      "Year unavailable"
                                    }

                                    {source.authors?.length > 0 &&
                                      ` • ${source.authors.join(", ")}`}

                                  </p>

                                </div>

                              </div>

                            </div>


                            <span className="
                              flex-shrink-0
                              text-sm
                              font-semibold
                              text-purple-400
                            ">
                              {source.similarity}%
                            </span>

                          </div>


                          <div className="
                            mt-3
                            flex
                            flex-wrap
                            items-center
                            gap-3
                          ">

                            {source.source_url && (

                              <a
                                href={source.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                  text-xs
                                  text-blue-400
                                  hover:text-blue-300
                                  transition
                                "
                              >
                                View Source ↗
                              </a>

                            )}


                            {source.pdf_url && (

                              <a
                                href={source.pdf_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                  text-xs
                                  text-purple-400
                                  hover:text-purple-300
                                  transition
                                "
                              >
                                Open PDF ↗
                              </a>

                            )}

                          </div>

                        </div>

                      ))

                    ) : (

                      <div className="
                        rounded-xl
                        bg-[#1F2937]
                        border
                        border-gray-700
                        p-5
                        text-center
                      ">

                        <p className="
                          text-sm
                          text-gray-500
                        ">
                          No relevant open-access scholarly
                          sources were found.
                        </p>

                      </div>

                    )}

                  </div>


                  {/* DISCLAIMER */}

                  <div className="
                    mt-5
                    rounded-xl
                    border
                    border-blue-500/20
                    bg-blue-500/5
                    p-4
                  ">

                    <p className="
                      text-xs
                      text-gray-400
                      leading-5
                    ">
                      External scholarly similarity is calculated
                      against the sources retrieved for this search.
                      It is not a complete plagiarism percentage for
                      the entire Internet or scholarly literature.
                    </p>

                  </div>

                </>

              )}

            </div>


            {/* ============================================== */}
            {/* MATCHING SECTIONS */}
            {/* ============================================== */}

            {result.matching_sections?.length > 0 && (

              <div className="
                bg-[#111827]
                border
                border-gray-600
                rounded-2xl
                p-6
              ">

                <div>

                  <h2 className="
                    text-lg
                    font-semibold
                    text-white
                  ">
                    Matching Sections
                  </h2>


                  <p className="
                    text-xs
                    text-gray-500
                    mt-1
                  ">
                    Sections with meaningful similarity to
                    reference content.
                  </p>

                </div>


                <div className="
                  mt-5
                  space-y-3
                ">

                  {result.matching_sections.map(
                    (section, index) => {

                    const isOpen =
                      !!openSections[index];


                    return (

                      <div
                        key={index}
                        className="
                          rounded-xl
                          bg-[#1F2937]
                          border
                          border-gray-700
                          overflow-hidden
                        "
                      >

                        <button
                          type="button"
                          onClick={() =>
                            toggleSection(index)
                          }
                          className="
                            w-full
                            px-4
                            py-4
                            flex
                            items-center
                            justify-between
                            gap-4
                            text-left
                          "
                        >

                          <div className="min-w-0">

                            <p className="
                              text-sm
                              font-semibold
                              text-white
                            ">
                              Matching Section {index + 1}
                            </p>


                            <p className="
                              text-xs
                              text-gray-500
                              mt-1
                            ">
                              {section.reference_document}
                            </p>

                          </div>


                          <div className="
                            flex
                            items-center
                            gap-3
                          ">

                            <span className="
                              text-xs
                              font-semibold
                              text-purple-400
                            ">
                              {section.combined_similarity}%
                            </span>


                            {isOpen ? (

                              <ChevronUp
                                size={18}
                                className="text-gray-400"
                              />

                            ) : (

                              <ChevronDown
                                size={18}
                                className="text-gray-400"
                              />

                            )}

                          </div>

                        </button>


                        {isOpen && (

                          <div className="
                            border-t
                            border-gray-700
                            p-4
                            space-y-4
                          ">

                            {/* STUDENT TEXT */}

                            <div>

                              <p className="
                                text-xs
                                font-semibold
                                text-purple-400
                                mb-2
                              ">
                                Your Text
                              </p>


                              <div className="
                                rounded-lg
                                bg-[#0B1220]
                                border
                                border-gray-700
                                p-4
                              ">

                                <p className="
                                  text-sm
                                  text-gray-300
                                  leading-6
                                ">
                                  {section.student_text}
                                </p>

                              </div>

                            </div>


                            {/* REFERENCE TEXT */}

                            <div>

                              <p className="
                                text-xs
                                font-semibold
                                text-blue-400
                                mb-2
                              ">
                                Reference Text
                              </p>


                              <div className="
                                rounded-lg
                                bg-[#0B1220]
                                border
                                border-gray-700
                                p-4
                              ">

                                <p className="
                                  text-sm
                                  text-gray-300
                                  leading-6
                                ">
                                  {section.reference_text}
                                </p>

                              </div>

                            </div>


                            {/* SCORES */}

                            <div className="
                              flex
                              flex-wrap
                              gap-4
                              text-xs
                            ">

                              <span className="text-gray-400">

                                TF-IDF:

                                <strong className="text-white ml-1">
                                  {section.tfidf_similarity}%
                                </strong>

                              </span>


                              <span className="text-gray-400">

                                Semantic:

                                <strong className="text-white ml-1">
                                  {section.semantic_similarity}%
                                </strong>

                              </span>


                              <span className="text-gray-400">

                                Combined:

                                <strong className="text-white ml-1">
                                  {section.combined_similarity}%
                                </strong>

                              </span>

                            </div>

                          </div>

                        )}

                      </div>

                    );

                  })}

                </div>

              </div>

            )}

          </>

        )}

      </div>

    </DashboardLayout>

  );

};


export default PlagiarismChecker;