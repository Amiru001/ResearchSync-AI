const submissions = [

    {
        title: "Research Proposal",
        status: "Approved",
    },

    {
        title: "Literature Review",
        status: "Pending",
    },

    {
        title: "Progress Report",
        status: "Reviewed",
    },

];

const RecentSubmissions = () => {

    return (

        <div className="bg-[#111827] rounded-xl p-6">

            <h2 className="text-white text-xl font-semibold mb-5">
                Recent Submissions
            </h2>

            <div className="space-y-4">

                {submissions.map((item, index) => (

                    <div
                        key={index}
                        className="flex justify-between bg-[#1F2937] p-4 rounded-lg"
                    >

                        <span className="text-white">
                            {item.title}
                        </span>

                        <span className="text-green-400">
                            {item.status}
                        </span>

                    </div>

                ))}

            </div>

        </div>

    );

};

export default RecentSubmissions;