import './App.css'
import {ChangeEvent, FormEvent, useState} from "react";
import * as yup from 'yup'

// Define the structure of the input data
type Input = {
    name: string,
    age: string;
    email: string
}

// Initial form values
const initialFormValue = {name: "", age: "", email: ""}

// Schema for form data validation using Yup
const formDataSchema = yup.object().shape({
    name: yup.string().required('Name is required').min(2, "Name needs to be at least 2 characters long."),
    age: yup.number().required('Age is required').positive('Age must be a positive number').integer('Age must be an integer').min(18,"You need to be at least 18 years old"),
    email: yup.string().email('Invalid email').required('Email is required'),
});

function App() {
    // State variables
    const [formData, setFormData] = useState<Input>(initialFormValue);
    const [submittedFormDatas, setSubmittedFormDatas] = useState<Input[]>([]);
    const [error, setError] = useState({});

    // Function to handle changes in the 'name' input field
    function handleChangeName(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setFormData({
            ...formData,
            name: value
        });
    }

    // Function to handle changes in the 'age' input field
    function handleChangeAge(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setFormData({
            ...formData,
            age: value
        });
    }

    // Function to handle changes in the 'email' input field
    function handleChangeEmail(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setFormData({
            ...formData,
            email: value
        });
    }

    // Function to handle form submission
    function handleOnSubmit(e:FormEvent<HTMLFormElement>) {
        e.preventDefault();
        formDataSchema.validate(formData, { abortEarly: false })
            .then(() => {
                setSubmittedFormDatas([...submittedFormDatas, formData]);
                setFormData({ name: '', age: "", email: '', });
                setError({});
            }).catch((validationErrors: yup.ValidationError) => {
            // Validation failed
            const errors = validationErrors.inner.reduce<{ [key: string]: string }>((acc, currentError) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                acc[currentError.path] = currentError.message;
                return acc;
            }, {});
            setError(errors);
        });
    }

    // Function to delete submitted input based on email
    function handleDeleteInput(email:string) {
        setSubmittedFormDatas(submittedFormDatas.filter(input => input.email !== email));
    }

    return (
        <>
            <h1>Simple Form with Yup Validation</h1>
            <form onSubmit={handleOnSubmit}>
                <div>
                    <label htmlFor={"name"}>Name:</label>
                    <input type={"text"} name={"name"} id={"name"} value={formData.name} onChange={handleChangeName}/>
                    {error.name && <div style={{color: "red"}}>{error.name}</div>}
                </div>
                <div>
                    <label htmlFor={"age"}>Age:</label>
                    <input type={"text"} name={"age"} id={"age"} value={formData.age} onChange={handleChangeAge} />
                    {error.age && <div style={{color: "red"}}>{error.age}</div>}
                </div>
                <div>
                    <label htmlFor={"email"}>Email:</label>
                    <input type={"email"} name={"email"} id={"email"} value={formData.email} onChange={handleChangeEmail}/>
                    {error.email && <div style={{color: "red"}}>{error.email}</div>}
                </div>
                <button type={"submit"}>Submit</button>
            </form>
            <ul>
                {submittedFormDatas.map(input => {
                    return <li key={input.email}>
                        <h2>Name: {input.name}</h2>
                        <h3>Age: {input.age}</h3>
                        <p>Email: {input.email}</p>
                        <button onClick={() => handleDeleteInput(input.email)}>X</button>
                    </li>
                })}
            </ul>
        </>
    );
}

export default App;
