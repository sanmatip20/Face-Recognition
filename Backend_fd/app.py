import io
import numpy
import cv2
import base64 
from fastapi import FastAPI, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from starlette.responses import StreamingResponse
from main_image import compare_person
from simple_facerec import SimpleFacerec

app = FastAPI()

sfr = SimpleFacerec()
sfr.load_encoding_images("images/")


origins =["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/upload")
async def receiveFile(file: bytes = File(...)):
    image = Image.open(io.BytesIO(file)).convert('RGB')
    regret_image=numpy.array(Image.open('./test/sorry.png').convert('RGB'))
    # converting PIL image to CV2 image
    open_cv_image = numpy.array(image) 
    open_cv_image = open_cv_image[:, :, ::-1].copy()
    
    # getting the face recognition results
    result ,facename= compare_person(open_cv_image, sfr)
    if(len(facename)):
        _, encoded_img = cv2.imencode('.PNG', result)
    # cv2.imshow('captured image',result)
    # cv2.waitKey(1)
    else:
        _, encoded_img = cv2.imencode('.PNG', regret_image)
    return StreamingResponse(io.BytesIO(encoded_img.tobytes()), media_type="image/png")
