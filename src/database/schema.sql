CREATE DATABASE clinicflow;

\c clinicflow;

CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    patient_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    birth_date DATE NOT NULL,
    cpf BIGINT NOT NULL,
    number_phone BIGINT NOT NULL
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
    number_phone BIGINT NOT NULL,
    doctor_photo TEXT NOT NULL,
    especialty_id INT REFERENCES especialty(id)
);

CREATE TABLE schedule (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(id),
    doctor_id INT REFERENCES doctor(id),
    consult_date DATE NOT NULL,
    consult_hour TIME NOT NULL
);

CREATE TABLE medicalrecord (
    id SERIAL PRIMARY KEY,
    patient_info TEXT,
    patient_id INT REFERENCES patients(id)
);

INSERT INTO patients(patient_name, email, password, birth_date, cpf, number_phone) VALUES('João Pereira', 'joao.pereira@gmail.com', 'senha123', '1990-03-25', 12345678901, 21912345678);

INSERT INTO especialty(especialty) VALUES('Cardiologista');

INSERT INTO doctor(name, email, password, birth_date, number_phone, doctor_photo,especialty_id) VALUES('Dr. Ana Silva', 'ana.silva@gmail.com', '312318u', '1980-05-15', 21987654321, 'https://www.google.com/imgres?q=imagem%20de%20doutor&imgurl=https%3A%2F%2Fdoutorhome.com.br%2Fwp-content%2Fuploads%2F2024%2F06%2Fmedicos-829x1024.png&imgrefurl=https%3A%2F%2Fdoutorhome.com.br%2F&docid=pBmw4ZGoUTzVbM&tbnid=LFvCJ6KQDvlDFM&vet=12ahUKEwi755ne89iQAxW6K7kGHcAkATkQM3oECBsQAA..i&w=829&h=1024&hcb=2&ved=2ahUKEwi755ne89iQAxW6K7kGHcAkATkQM3oECBsQAA', 1);

INSERT INTO schedule(patient_id, doctor_id, consult_date, consult_hour) VALUES(1, 1, '2025-12-10', '10:30:00');

INSERT INTO medicalrecord(patient_info, patient_id) VALUES('Paciente possui problemas no coração', 1);