import logo from './logo.svg';
import './App.css';
import { CameraFeed } from './components/ImageCapture';
import { useState } from 'react';
import { Modal, Container, Center, Stack, Loader, Image, Input, InputWrapper, Text, Title, Stepper, Button, Space } from '@mantine/core';

function App() {

  const [image, setImage] = useState();
  const [opened, setOpened] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [name, setName] = useState('');
  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 2 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const handleNameChange = (e) => {
    setName(e.target.value);
  }

  const onButtonPress = () => {
    nextStep();
  }

  const uploadImage = async (_blob) => {
    setImage(null);
    nextStep();
    setOpened(true);
    setShowLoader(true);

    const formData = new FormData();
    const myFile = new File([_blob], 'image.jpg', {
      type: _blob.type,
    });

    formData.append('file', myFile, myFile.name);
    const requestOptions = {
      method: 'POST',
      body: formData
    };

    const response = await fetch('http://localhost:8000/upload', requestOptions);
    const blob = await response.blob();

    setImage(URL.createObjectURL(blob));
    setShowLoader(false);
  };

  return (
    <Container>
      <Center>
        <Title>
          Face Recognition App
        </Title>
      </Center>
      <Center>
        <Text order={1}>By Sanmati Pande</Text>
      </Center>
      <Space h="xl" />
      <Center>
        <Stepper color="red" active={active} onStepClick={setActive} breakpoint="sm">
          <Stepper.Step label="First Step" description="Enter name">
          </Stepper.Step>
          <Stepper.Step label="Second Step" description="Take a picture">
          </Stepper.Step>
          <Stepper.Completed>
            Completed! Hope you are delighted with the results.
          </Stepper.Completed>
        </Stepper>
      </Center>
      <Space h="xl" />
      <Center size="xl">
        <Stack size="xl">
          {active === 0 &&
            <InputWrapper
              id="name"
              label="NAME:"
              size="xl"
            >
              <Input size="xl" type="text" variant='filled' color='red' onChange={handleNameChange} />
              <Space h="sm" />
              <Button color="red" variant='outline' onClick={onButtonPress}>Submit</Button>
            </InputWrapper>
          }
          {active === 1 &&
            <CameraFeed sendFile={uploadImage}></CameraFeed>
          }
        </Stack>
      </Center>
      {active === 2 &&
        <Center>
          <Modal
            opened={opened}
            onClose={() => { setOpened(false); prevStep(); }}
            title="Analysis!"
          >
            {name !== '' && <Text>Name: {name}</Text>}
            {showLoader && <Loader color="red" />}
            {image && <Image radius="md" src={image} alt="uploaded" />}
          </Modal>
        </Center>
      }
    </Container>
  );
}

export default App;
