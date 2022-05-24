import cv2
from simple_facerec import SimpleFacerec

sfr = SimpleFacerec()

sfr.load_encoding_images("images/")

def compare_person(img, sfr):
    face_locations, face_names = sfr.detect_known_faces(img)
    print("facename",face_locations,face_names)
    for face_loc, name in zip(face_locations, face_names):
        y1, x2, y2, x1 = face_loc[0], face_loc[1], face_loc[2], face_loc[3]
        cv2.putText(img, name,(x1, y1 - 10), cv2.FONT_HERSHEY_DUPLEX, 1, (0, 0, 200), 2)
        cv2.rectangle(img, (x1, y1), (x2, y2), (0, 0, 200), 4)
    return (img,face_names)

if __name__ == "__main__":
    img = cv2.imread('test/main')
    img_ret = compare_person(img)
    cv2.imshow("Image", img_ret)
    cv2.waitKey(0)