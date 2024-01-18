"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { AgeLimits, VideoGenres, VideoTape } from "../../../utils/videoTapesUtils";
import { useUser } from "@auth0/nextjs-auth0/client";
import Loading from "../../../components/Loading";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function EditVtPage({ params }) {
    const router = useRouter();
    const { user, isLoading } = useUser();
    const [formData, setFormData] = useState<VideoTape>(
        {
            gn_name: '',
            vt_age_limits: '',
            vt_description: '',
            vt_director: '',
            vt_format: '',
            vt_genre_id: 0,
            vt_id: 0,
            vt_length: '',
            vt_name: '',
            vt_year: 0
        }
    );
    const [isEditCompleted, setIsEditCompleted] = useState<boolean>(false);
    const vtId: string = params.slug.split('-')[1];

    useEffect(() => {
        try {
            fetch('/api/mssql/video-tapes/get-vt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ vtId: vtId })
            })
                .then(response => response.json())
                .then(data => {
                    const vtInfo: VideoTape = data.videoTape[0];
                    setFormData(vtInfo);
                })
                .catch(error => console.error('Error:', error))
        } catch (error) {
            console.log(error);
        }
    }, [])

    useEffect(()=>{
        if(isEditCompleted){
            router.push('/vt-list');
        }
    }, [isEditCompleted])

    function handleChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    }

    function handleSubmit() {
        fetch('/api/mssql/video-tapes/edit-vt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ formData: formData })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setIsEditCompleted(true);
            })
            .catch(error => console.error('Error:', error))
    }


    if (!isLoading) {
        return (
            <>
                <div className="add-video mb-5">
                    <Row style={{ display: 'flex', alignItems: 'center' }}>
                        <Col xs='1'>
                            <FontAwesomeIcon onClick={() => router.back()} icon={faArrowLeft} style={{ fontSize: '2rem', cursor: 'pointer' }} />
                        </Col>
                        <Col>
                            <h3>Edycja kasety wideo w bazie</h3>
                        </Col>
                    </Row>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="vt_name">Nazwa filmu:</Label>
                            <Input type="text" name="vt_name" id="vt_name" value={formData.vt_name} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="vt_genre_id">Gatunek:</Label>
                            <Input type="select" name="vt_genre_id" id="vt_genre_id" value={formData.vt_genre_id} onChange={handleChange} required>
                                {
                                    VideoGenres.map((genre, index) => {
                                        return <option key={index} value={genre.id}>{genre.name}</option>
                                    })
                                }
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="vt_age_limits">Ograniczenia wiekowe:</Label>
                            <Input type="select" name="vt_age_limits" id="vt_age_limits" value={formData.vt_age_limits} onChange={handleChange} required>
                                {
                                    AgeLimits.map((ageLimit, index) => {
                                        return <option key={index} value={AgeLimits[index]}>{ageLimit}</option>
                                    })
                                }
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="vt_description">Opis filmu:</Label>
                            <Input type="textarea" name="vt_description" id="vt_description" value={formData.vt_description} maxLength={1000} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="vt_year">Rok produkcji:</Label>
                            <Input type="number" name="vt_year" id="vt_year" value={formData.vt_year} onChange={(e) => handleChange(e)} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="vt_director">Reżyser:</Label>
                            <Input type="text" name="vt_director" id="vt_director" value={formData.vt_director} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="vt_format">Format filmu:</Label>
                            <Input type="text" name="vt_format" id="vt_format" value={formData.vt_format} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="vt_length">Długość filmu (minuty):</Label>
                            <Input type="text" name="vt_length" id="vt_length" value={formData.vt_length} onChange={handleChange} />
                        </FormGroup>
                        <Button type="submit">Edytuj kasetę</Button>
                    </Form>
                </div>
            </>
        )
    } else {
        return <Loading />
    }
}