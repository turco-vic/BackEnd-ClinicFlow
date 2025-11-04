CREATE DATABASE clinicflow;

\c clinicflow;

CREATE TABLE patient (
    id SERIAL PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    cpf INT NOT NULL,
    number_phone INT NOT NULL
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
    birth_date DATE NOT NULL,
    number_phone INT NOT NULL
    especialty_id INT REFERENCES especialty(id)
);

CREATE TABLE schedule (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patient(id),
    doctor_id INT REFERENCES doctor(id),
    consult_date DATE NOT NULL,
    consult_hour TIME NOT NULL
);

CREATE TABLE medicalrecord (
    id SERIAL PRIMARY KEY,
    patient_info TEXT,
    patient_id INT REFERENCES patient(id)
);

INSERT INTO patient(patient_name, email, password, birth_date, cpf, number_phone) VALUES('Roberto', 'roberto123@gmail.com', '123kopk', '2025-12-04', 76755347861, 1940028922);

INSERT INTO especialty(especialty) VALUES('Cardiologista');

INSERT INTO doctor(name, email, password, birth_date, number_phone, especialty_id) VALUES('Dr. Ana Silva', 'ana.silva@gmail.com', '312318u', '1980-05-15', 21987654321, 1);

INSERT INTO schedule(patient_id, doctor_id, consult_date, consult_hour) VALUES(1, 1, '2025-12-10', '10:30:00');

INSERT INTO medicalrecord(patient_info, patient_id) VALUES('Paciente possui problemas no coração', 1);