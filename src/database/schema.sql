CREATE DATABASE clinicflow;

\c clinicflow;

CREATE TABLE patient (
    id SERIAL PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE especialty (
    id SERIAL PRIMARY KEY,
    especialty VARCHAR(255) NOT NULL
);

CREATE TABLE doctor (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    especialty_id INT REFERENCES especialty(id)
);

CREATE TABLE schedule (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patient(id),
    doctor_id INT REFERENCES doctor(id),
    consult_date DATE NOT NULL
);
