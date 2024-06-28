import { Workout } from "../types/User";

export const DashboardComponent = ({ user, workouts }: { user: any; workouts: Workout[] }) => {
    return (
        <div class="min-h-screen bg-gray-100 p-6">
            <div class="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h1 class="text-2xl font-semibold mb-4">Welcome, {user.email}</h1>
                <a class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" hx-boost="true" href="/app/add-workout" >New Workout</a>
                <div class="mt-6" id="workout-list">
                    {workouts.length > 0 ? (
                        <ul >
                            {workouts.map(workout => (
                                <li class="flex justify-between items-center bg-gray-50 p-4 mb-2 rounded shadow" id={`workout-${workout.id}`}>
                                    <span class="text-lg">{workout.date}</span>
                                    <div>
                                        <button class="bg-yellow-500 text-white px-3 py-1 mr-2 rounded hover:bg-yellow-600 focus:outline-none">Edit</button>
                                        <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none"
                                            hx-delete={`/app/delete-workout/${workout.id}`}
                                            hx-target={`#workout-${workout.id}`}
                                            hx-swap="outerHTML">Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (<p></p>
                    )}
                </div>
            </div>

        </div>
    )
}