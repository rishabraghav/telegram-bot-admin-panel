import axios from "axios";
import { useEffect, useState } from "react"

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [weatherTime, setWeatherTime] = useState("");
    const [customMessage, setCustomMessage] = useState("");
    const [currentWeather, setCurrentWeather] = useState("");
    const [open, setOpen] = useState(false);
    const [time, setTime] = useState({
        hour: "",
        minute: "",
    })


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/telegram-bot/checkusers')
                setUsers(response.data)

                const timeResponse = await axios.get('http://localhost:3000/telegram-bot/defaulttime')
                const time = timeResponse.data.split(" ")
                setWeatherTime(time);

                const weatherResponse = await axios.get('http://localhost:3000/telegram-bot/currentweather')
                setCurrentWeather(weatherResponse.data);

            } catch (err) {
                console.error(err);
            }
        }
        fetchUsers();
    }, [time])

    const handleMessage = async () => {
        const message = {
            customMessage: customMessage
        }

        try {
            const response = await axios.post('http://localhost:3000/telegram-bot/sendmessage', message);
            console.log(response.data)
        } catch (err) {
            console.error(err);
        }
        setCustomMessage("")
    }

    const handleUnsubscribe = async (chatId) => {
        try {
            const response = await axios.delete(`http://localhost:3000/telegram-bot/unsubscribe/${chatId}`);
            if (response.status === 200) {
                console.log(`Successfully unsubscribed user with chatId ${chatId}`);
                window.location.reload()
            } else {
                console.error(`Failed to unsubscribe user with chatId ${chatId}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleClick = async () => {
        setOpen(!open);
    }
    // Function to handle changes in the hour input
    const handleHourChange = (e) => {
        const newHour = e.target.value;
        setTime((prevTime) => ({
            ...prevTime,
            hour: newHour,
        }));
    };

    // Function to handle changes in the minute input
    const handleMinuteChange = (e) => {
        const newMinute = e.target.value;
        setTime((prevTime) => ({
            ...prevTime,
            minute: newMinute,
        }));
    };

    const handleTime = async() => {
        const timeInString = `${time.minute} ${time.hour} * * *`;

        const timeObject = { 
            newSchedule: timeInString
        }

        try {
            const response = await axios.post('http://localhost:3000/telegram-bot/changetime', timeObject)
            console.log(response.data)
        } catch(err) {
            console.error(err);
        }

        setTime({
            hour: "",
            minute: ""
        })
        setOpen(!open)
    }

    const handleCurrentWeather = async() => {
        try {
           const response = await axios.get('http://localhost:3000/telegram-bot/sendweatherupdate')
           console.log(response)
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="h-full w-3/4 flex place-self-center py-8 flex-col space-y-8 max-md:space-y-2 max-sm:space-y-2 drop-shadow-md ">
            <div className="w-full flex space-x-8 max-sm:flex-col max-md:flex-col max-sm:space-x-0 max-sm:space-y-2 max-sm:items-center
                            max-md:space-x-0 max-md:space-y-2 max-md:items-center">
                <div className="border bg-white w-64 h-48 p-2 flex flex-col rounded-md">
                    <p className="text-sm text-slate-500">No. of Subscribers</p>
                    <p className="w-full h-full flex justify-center items-center text-blue-500">{users.length}</p>
                </div>
                <div className="border bg-white w-64 h-48 p-2 flex flex-col rounded-md">
                    <p className="text-sm text-slate-500">Default Weather time</p>
                    <p className="w-full h-full flex justify-center items-center text-blue-500 text-3xl">{weatherTime ? `${weatherTime[1]} hrs & ${weatherTime[0]} mins` : 'loading...'}</p>
                </div>
                <div className="border bg-white w-1/2 max-sm:w-64 h-48 p-3 flex flex-col rounded-md">
                    <p className="text-sm text-slate-500">Send a custom message to all users</p>
                    <textarea onChange={(e) => { setCustomMessage(e.target.value) }} value={customMessage} className="border rounded-sm h-full text-lg px-2 py-1" />
                    <button onClick={handleMessage} className="text-xl py-1 bg-blue-500 active:opacity-60 rounded-md mt-2 text-white">SEND</button>
                </div>
            </div>
            <div className="w-full flex space-x-8 max-sm:flex-col max-md:flex-col max-sm:space-x-0 max-sm:space-y-2 max-sm:items-center
                            max-md:space-x-0 max-md:space-y-2 max-md:items-center h-full">
                <div className="w-64 h-48 flex flex-col rounded-md items-center">
                    <button onClick={handleClick} className="bg-blue-500 active:opacity-60 w-full py-2 rounded-lg h-fit text-xl text-white mb-3">Change Default Time</button>
                    <div className="bg-white rounded-md p-2">
                        <p className="text-lg place-self-start">Weather</p>
                        <p className="text-sm text-slate-500">{currentWeather ? currentWeather : 'loading...'}</p>
                    </div>
                    <button onClick={handleCurrentWeather} className="bg-blue-500 active:opacity-60 w-full py-2 rounded-lg h-fit text-xl text-white mb-3">Send Current Weather</button>
                </div>
                <div className="border bg-white w-1/2 max-sm:w-64 p-3 flex flex-col rounded-md text-sm">
                    <p className="text-sm text-slate-500">All Subscribers</p>
                    <div className="flex justify-between p-2">
                        <p>Sno.</p>
                        <p>Chat ID</p>
                        <p>Action</p>
                    </div>
                    <div className="flex w-full flex-col">
                        {users.map((element, index) => (
                            <div key={index} className="flex justify-between w-full border rounded-xl">
                                <p className="px-2">{index}</p>
                                <p className="h-full flex justify-center items-center text-blue-500 pl-8">{element.chatId}</p>
                                <button
                                    onClick={() => handleUnsubscribe(element.chatId)}
                                    className="text-white border rounded-full px-1 bg-red-500">Unsubscribe</button>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
            {open &&
                <div className="fixed top-0 h-full w-full flex justify-center items-center bg-black bg-opacity-75 rounded-xl">
                    <div className="border relative flex flex-col h-fit bg-white pt-5 py-1 rounded-md space-y-4 p-1 w-1/3">
                        <button onClick={handleClick} className="absolute h-5 w-5 bg-red-500 -top-0 rounded-full -right-0"></button>
                        <p className="text-3xl">Set time manually</p>
                        <input value={time.hour} onChange={handleHourChange} placeholder="Hour" className="border text-lg" type="number" max={23} min={0} />
                        <input value={time.minute} onChange={handleMinuteChange} placeholder="Minutes" className="border text-lg" type="number" max={59} min={0} />
                        <button onClick={handleTime} className="bg-blue-500 active:opacity-60 w-full py-2 rounded-lg h-fit text-xl text-white mb-3">Submit</button>
                    </div>
                </div>
            }

        </div>
    )
}

export default Dashboard