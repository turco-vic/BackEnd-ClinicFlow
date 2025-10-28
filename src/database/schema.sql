CREATE DATABASE dbclinicflow;

\c dbclinicflow;

CREATE TABLE patient_dashboard (
    id SERIAL PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(10) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) NOT NULL
);

CREATE TABLE professional_dashboard (
    id SERIAL PRIMARY KEY,
    professional_name VARCHAR(100) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL
);