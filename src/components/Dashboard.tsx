import { Device } from "../types/User";

export const DashboardComponent = ({ user, devices }: { user: any; devices: Device[] }) => {
    return (
        <div class="min-h-screen bg-gray-100 p-6">
            <div class="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h1 class="text-2xl font-semibold mb-4">Welcome, {user.email}</h1>
                <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none"
                    hx-get="/app/add-device-form"
                    hx-target="#modal"
                    hx-trigger="click"
                    hx-swap="outerHTML">Add device</button>
                <div class="mt-6" id="device-list">
                    {devices.length > 0 ? (
                        <ul >
                            {devices.map(device => (
                                <li class="flex justify-between items-center bg-gray-50 p-4 mb-2 rounded shadow" id={`device-${device.id}`}>
                                    <span class="text-lg">{device.name}</span>
                                    <div>
                                        <button class="bg-yellow-500 text-white px-3 py-1 mr-2 rounded hover:bg-yellow-600 focus:outline-none">Alarm</button>
                                        <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none"
                                            hx-delete={`/app/delete-device/${device.id}`}
                                            hx-target={`#device-${device.id}`}
                                            hx-swap="outerHTML">Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (<p></p>
                    )}
                </div>
            </div>

            <div id="modal" class="hidden">
                <div id="modal-content" class="bg-white p-6 rounded-lg shadow-lg w-1/2">
                    {/* Modal content will be dynamically inserted here */}
                </div>
            </div>
        </div>
    )
}



export const AddDeviceModal: any = () => {
    return (
        <div id="modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div id="modal-content" class="bg-white p-6 rounded-lg shadow-lg w-1/2">
                <div>
                    <h2 class="text-xl font-semibold mb-4">Add a new device</h2>
                    <form hx-post="/app/add-device" hx-target="#device-list" hx-swap="beforeend">
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="device-name">Device Name</label>
                            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="device_name" name="device_name" type="text" placeholder="Device Name" />
                        </div>
                        <div class="flex items-center justify-between">
                            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Add</button>
                            <button class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="button"
                                    hx-get="/app/closemodal"
                                    hx-target="#modal"
                                    hx-swap="outerHTML">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}



export const CloseModal =  () => {
    return (
    <div class="hidden" id="modal"></div>
    )
}