import { supabase } from "./supabaseClient";
import { Elysia, redirect } from "elysia";
import Layout from "../components/Layout";
import Register from "../components/Register";
import { html } from '@elysiajs/html'
import Login from "../components/Login";
import * as elements from "typed-html";
import { auth, deriveUser } from "./authModule";
import { DashboardComponent } from "../components/Dashboard";
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";
import { User } from "@supabase/supabase-js";
import { Workout } from '../types/User'
import { sleep } from "bun";


const getWorkouts = async (user: User) => {
    if (!user) {
        throw new Error ("User required to fetch workouts")
    }
    const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
    if (error) {
        throw new Error (error.message) 
        return []
    }

    return data || [];
}

const addWorkout = async (user: User, workout: Workout) => {
    if (!user) {
        throw new Error("User required to add workout")
    }
    const { data, error } = await supabase
        .from('workouts')
        .insert([{ ...workout, user_id: user.id }])
        .select('id, name')
        .single()
    if (error) {
        throw new Error(error.message)
    }
    console.log(data)
    return data;
}

const deleteWorkouts = async (user: User, workoutId: string) => {
    console.log(user.id)
    console.log(workoutId)
    if (!user) {
        throw new Error("User required to delete workout");
    }
    const { data, error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', workoutId);
    console.log(data)

    if (error) {
        throw new Error(error.message);
    }
    return data;
}


export const appModule = (app: Elysia) => 
    app
        .group("/app", (group) => 
            group
                .get("/dashboard", async ({ html, user}: any) => {
                    if (user == null) return redirect("/auth/sign-in") 
                    return html(
                        <Layout title="GymTracc - Dashboard" user={user}>
                            <DashboardComponent user={user as User} workouts={ await getWorkouts(user)}/>
                        </Layout>
                    )
                })
                .get("/add-workout", async ({html, user}: any) => {
                    return html(
                        <Layout title="GymTracc - Add Workout">
                            <h1>Test</h1>
                        </Layout>
                    )
                })
                .post("/add-workout", async ({ body, user }: { body: { workout_name: string , workout_date: string}, user: User }) => {
                    if (user == null) return redirect("/auth/sign-in");
                    const workout: Workout = {
                        name: body.workout_name,
                        date: body.workout_date
                    }
                    const newWorkout: any = await addWorkout(user, workout);
                    return new Response(
                        `<li class="flex justify-between items-center bg-gray-50 p-4 mb-2 rounded shadow" id="workout-${newWorkout.id}">
                            <span class="text-lg">${newWorkout.name}</span>
                            <div>
                                <button class="bg-yellow-500 text-white px-3 py-1 mr-2 rounded hover:bg-yellow-600 focus:outline-none">Alarm</button>
                                <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none"
                                    hx-delete="/app/delete-workout/${newWorkout.id}"
                                    hx-target="#workout-${newWorkout.id}"
                                    hx-swap="outerHTML">Delete</button>
                            </div>
                        </li>
                        <script>
                            document.querySelector("#modal").outerHTML = "";
                        </script>`, { headers: { 'Content-Type': 'text/html' } });
                })
                .delete("/delete-workout/:id", async ({ user, params: { id }}: { user: User, params: any}) => {
                    await deleteWorkouts(user, id)

                })
            )