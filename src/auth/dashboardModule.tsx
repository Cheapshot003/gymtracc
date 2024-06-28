import { supabase } from "./supabaseClient";
import { Elysia, redirect } from "elysia";
import Layout from "../components/Layout";
import Register from "../components/Register";
import { html } from '@elysiajs/html'
import Login from "../components/Login";
import * as elements from "typed-html";
import { auth, deriveUser } from "./authModule";
import {DashboardComponent, AddDeviceModal, CloseModal} from "../components/Dashboard";
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";
import { User } from "@supabase/supabase-js";
import { Device } from '../types/User'
import { sleep } from "bun";


const getDevices = async (user: User) => {
    if (!user) {
        throw new Error ("User required to fetch devices")
    }
    const { data, error } = await supabase
        .from('devices')
        .select('*')
        .eq('user_id', user.id)
    if (error) {
        throw new Error (error.message) 
        return []
    }

    return data || [];
}

const addDevice = async (user: User, device: Device) => {
    if (!user) {
        throw new Error("User required to add device")
    }
    const { data, error } = await supabase
        .from('devices')
        .insert([{ ...device, user_id: user.id }])
        .select('id, name')
        .single()
    if (error) {
        throw new Error(error.message)
    }
    console.log(data)
    return data;
}

const deleteDevice = async (user: User, deviceId: string) => {
    console.log(user.id)
    console.log(deviceId)
    if (!user) {
        throw new Error("User required to delete device");
    }
    const { data, error } = await supabase
        .from('devices')
        .delete()
        .eq('id', deviceId);
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
                        <Layout title="MasterWarning - Dashboard" user={user}>
                            <DashboardComponent user={user as User} devices={ await getDevices(user)}/>
                        </Layout>
                    )
                })
                .post("/add-device", async ({ body, user }: { body: { device_name: string }, user: User }) => {
                    if (user == null) return redirect("/auth/sign-in");
                    const device: Device = {
                        name: body.device_name
                    }
                    const newDevice: any = await addDevice(user, device);
                    return new Response(
                        `<li class="flex justify-between items-center bg-gray-50 p-4 mb-2 rounded shadow" id="device-${newDevice.id}">
                            <span class="text-lg">${newDevice.name}</span>
                            <div>
                                <button class="bg-yellow-500 text-white px-3 py-1 mr-2 rounded hover:bg-yellow-600 focus:outline-none">Alarm</button>
                                <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none"
                                    hx-delete="/app/delete-device/${newDevice.id}"
                                    hx-target="#device-${newDevice.id}"
                                    hx-swap="outerHTML">Delete</button>
                            </div>
                        </li>
                        <script>
                            document.querySelector("#modal").outerHTML = "";
                        </script>`, { headers: { 'Content-Type': 'text/html' } });
                })
                .delete("/delete-device/:id", async ({ user, params: { id }}: { user: User, params: any}) => {
                    await deleteDevice(user, id)

                })
                .get("/add-device-form", async ({html}: any) => {
                    return html(
                        <AddDeviceModal/>
                    )
                })
                .get("/closemodal", async ({html}: any) => {
                    return html(
                        <CloseModal />
                    )
                })

            )