"use client"
import Link from 'next/link';
import { Router } from 'next/router';
import react, { useEffect, useState } from "react";
import { Button, Spinner } from "reactstrap";

interface VideoTape {
    id: number;
    name: string;
    year: number;
    director: string;
    format: string;
    length: string;
    description: string;
    isAvaible: boolean;
    ageLimits: string;
    genre: string;
    price: number;
}

export default function VideoTapesList() {
    const [videoTapesList, setVideoTapesList] = useState<VideoTape[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        fetch('/api/mssql/get-vt-list',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                setVideoTapesList(data.vtList);
                setIsLoading(false);
            })
            .catch(error => {
                console.log(error);
            })
    }, [])

    if (!isLoading) {
        return (
            <div>
                <div className="header"><Link href={'/'}><Button>Dodaj kasetę</Button></Link></div>
                <h1>Lista kaset wideo:</h1>
                {
                    videoTapesList != null && videoTapesList.map((videoTape) => {
                        return (
                            <div key={videoTape?.id}>
                                <h3>{videoTape?.name}</h3>
                                <p>{videoTape?.description}</p>
                            </div>
                        )
                    })
                }
            </div>
        )
    } else {
        return (
            <div>
                <Spinner type="grow">
                    Loading...
                </Spinner>
            </div>
        )
    }
}