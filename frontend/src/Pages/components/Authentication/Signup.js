import { FormControl, FormLabel,  InputRightElement,  VStack,Button } from '@chakra-ui/react';
//import { FormControl, FormLabel } from '@chakra-ui/react';
import { Input ,InputGroup} from '@chakra-ui/react';
//import { VStack } from '@chakra-ui/react';
import React, { useState } from "react";
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
//import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const Signup = () => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [password, setPassword] = useState();
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();

    const handleClick = () => setShow(!show);
    
    const postDetails = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: "please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "Private_CHAT_App");
            data.append("cloud_name", "shivmishrajee");
            fetch("https://api.cloudinary.com/v1_1/shivmishrajee/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setPic(data.url.toString());
                    // console.log(data.url.toString());
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);

                });
        } else {
              
             toast({
                title: "please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
             });
            setLoading(false);
            return;
        }
     };

    const submitHandler = async() => { 
        setLoading(true);

        if (!name || !email || !password || !confirmpassword) {
             toast({
                title: "please Fill all the Feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
             });
            setLoading(false);
            return;
        }
        if (password !== confirmpassword) {
             toast({
                title: "Password Do Not Match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
             });
           
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post("/api/user",
                { name, email, password, pic },
               config
            );
            toast({
                title: "Registration Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            
            localStorage.setItem("userInfo", JSON.stringify(data));

            setLoading(false);
            history.pushState("/chats")
            
        } catch (error) {
            
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
             });
            setLoading(false);
        }

    };

    return (<VStack Spacing="5px">
        <FormControl  id="first-name" isrequired>
            <FormLabel >Name</FormLabel>  
            <Input
                placeholder='Enter Your Name'
                onChange={(e)=>setName(e.target.value)}
            />
        </FormControl>
        
        <FormControl  id="email" isrequired>
            <FormLabel >Email</FormLabel>  
            <Input
                placeholder='Enter Your Email'
                onChange={(e)=>setEmail(e.target.value)}
            />
        </FormControl>
        
         <FormControl  id="password" isrequired>
            <FormLabel > Password</FormLabel>  
            <InputGroup size="md">
                <Input
                    type={show?"text":'password' }
                placeholder='Password'
                onChange={(e)=>setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem" >
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                     {show ? "Hide" :"Show"}
                    </Button>

                </InputRightElement>
            </InputGroup>
                
        </FormControl>
        

        <FormControl  id="password" isrequired>
            <FormLabel >Confirm Password</FormLabel>  
            <InputGroup size="md">
                <Input
                    type={show?"text":'password' }
                placeholder='Confirm password'
                onChange={(e)=>setConfirmpassword(e.target.value)}
                />
                <InputRightElement width="4.5rem" >
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                     {show ? "Hide" :"Show"}
                    </Button>

                </InputRightElement>
            </InputGroup>
                
        </FormControl>
        

        <FormControl  id="pic" isrequired>
            <FormLabel >Upload your picture</FormLabel>  
            <Input
                Type="file"
                p={1.5}
                accept="image/*"
                onChange={(e) => postDetails(e.target.files[0])}
           />
                
        </FormControl>
        
        <Button
            colorScheme="blue"
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
            isLoading={ loading }
        >
           Sign Up
        </Button>
        
    </VStack>
    );
  
};

export default Signup
