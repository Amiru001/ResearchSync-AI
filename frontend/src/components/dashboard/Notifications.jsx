const notifications = [

    "Supervisor approved your proposal.",

    "New meeting scheduled.",

    "Research deadline is approaching.",

];

const Notifications = () => {

    return (

        <div className="bg-[#111827] rounded-xl p-6">

            <h2 className="text-white text-xl font-semibold mb-5">
                Notifications
            </h2>

            <div className="space-y-4">

                {notifications.map((item, index) => (

                    <div
                        key={index}
                        className="bg-[#1F2937] rounded-lg p-4 text-white"
                    >
                        {item}
                    </div>

                ))}

            </div>

        </div>

    );

};

export default Notifications;