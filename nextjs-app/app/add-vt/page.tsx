'use client'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from "react";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { AgeLimits, VideoGenres } from "../../utils/videoTapesUtils";
import { redirect } from "next/dist/server/api-utils";
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { Router } from 'next/router';
import { useRouter } from 'next/navigation';
import { DbUser } from '../../utils/userUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';


interface VideoTape {
    name: string;
    genre_id: number;
    age_limits: string;
    description: string;
    image: string;
    year: number;
    director: string;
    format: string;
    length: string;
}

export default withPageAuthRequired(AddVideoTape, {
    onRedirecting: () => <Loading />,
    onError: error => <ErrorMessage>{error.message}</ErrorMessage>
});

function AddVideoTape() {
    const { user, isLoading } = useUser();
    const [formData, setFormData] = useState<VideoTape>({
        name: '',
        genre_id: 0,
        age_limits: '',
        description: '',
        image: '',
        year: 0,
        director: '',
        format: '',
        length: ''
    })
    const [dbUser, setDbUser] = useState<DbUser>();
    
    useEffect(() => {
        fetch('/api/mssql/get-user-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user: user })
        })
        .then(response => response.json())
        .then(data => {
            const userInfo: DbUser = data.userInfo;
            setDbUser(userInfo);
        })
        .catch(error => console.error('Error:', error))
    }, [])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    }

    const router = useRouter();
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/api/mssql/video-tapes/add-vt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ formData: formData, user: user })
        })
            .then(response => response.json())
            .then(data => { console.log('Success:', data); router.push('/vt-list'); })
            .catch(error => console.error('Error:', error));
    };

    if (user && dbUser?.user_role_id === 1) {
        return (
            <>
                {isLoading && <Loading />}
                {user && <div className="add-video mb-5">
                    <Row style={{display: 'flex', alignItems: 'center'}}>
                        <Col xs='1'>
                            <FontAwesomeIcon onClick={() => router.back()} icon={faArrowLeft} style={{fontSize: '2rem', cursor: 'pointer'}}/>
                        </Col>
                        <Col>
                        <h3>Dodaj kasetę wideo do bazy</h3>
                        </Col>
                    </Row>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="name">Nazwa filmu:</Label>
                            <Input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="genre_id">Gatunek:</Label>
                            <Input type="select" name="genre_id" id="genre_id" value={formData.genre_id} onChange={handleChange} required>
                                {
                                    VideoGenres.map((genre, index) => {
                                        return <option key={index} value={genre.id}>{genre.name}</option>
                                    })
                                }
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="age_limits">Ograniczenia wiekowe:</Label>
                            <Input type="select" name="age_limits" id="age_limits" value={formData.age_limits} onChange={handleChange} required>
                                {
                                    AgeLimits.map((ageLimit, index) => {
                                        return <option key={index} value={AgeLimits[index]}>{ageLimit}</option>
                                    })
                                }
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="description">Opis filmu:</Label>
                            <Input type="textarea" name="description" id="description" value={formData.description} maxLength={1000} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="year">Rok produkcji:</Label>
                            <Input type="number" name="year" id="year" value={formData.year} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="director">Reżyser:</Label>
                            <Input type="text" name="director" id="director" value={formData.director} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="format">Format filmu:</Label>
                            <Input type="text" name="format" id="format" value={formData.format} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="length">Długość filmu (minuty):</Label>
                            <Input type="text" name="length" id="length" value={formData.length} onChange={handleChange} />
                        </FormGroup>
                        <Button type="submit">Dodaj kasetę</Button>
                    </Form>
                </div>}
            </>
        )
    } else {
        return <div>
            <h1>Brak uprawnień</h1>
        </div>
    }
}