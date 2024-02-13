// api > hello > route.ts
import {NextRequest, NextResponse} from "next/server";

export async function GET (request: NextRequest){
    const greeting = "Hello World!!"
    const json = {
        greeting
    };
    
    return NextResponse.json(json);
}