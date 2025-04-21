import os
import PyPDF2
import docx
import re


def extract_text_from_pdf(file_path):
    """Extract text from PDF files"""
    text = ""
    with open(file_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            text += page.extract_text()
    return text


def extract_text_from_docx(file_path):
    """Extract text from DOCX files"""
    doc = docx.Document(file_path)
    text = ""
    for paragraph in doc.paragraphs:
        text += paragraph.text + "\n"
    return text


def extract_text_from_txt(file_path):
    """Extract text from TXT files"""
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as file:
        text = file.read()
    return text


def extract_text_from_file(file_path, file_type=None):
    """Extract text from various file types"""
    if not file_type:
        file_type = os.path.splitext(file_path)[1].lower()
    
    if file_type.endswith('pdf'):
        return extract_text_from_pdf(file_path)
    elif file_type.endswith('docx'):
        return extract_text_from_docx(file_path)
    elif file_type.endswith('txt'):
        return extract_text_from_txt(file_path)
    else:
        raise ValueError(f"Unsupported file type: {file_type}")


def preprocess_text(text):
    """Preprocess text for plagiarism detection"""
    # Convert to lowercase
    text = text.lower()
    
    # Remove special characters and extra whitespace
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text
