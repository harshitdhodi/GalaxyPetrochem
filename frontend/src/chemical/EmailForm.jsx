import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail } from 'lucide-react';
import { useGetAllTemplatesQuery } from '@/slice/template/emailTemplate';

const EmailForm = ({ selectedSupplier, supplier, email, name,type, chemicalName }) => {
  console.log("Type:", type);
  console.log("Supplier Array:", supplier);
  console.log("Supplier Email:", supplier[0]?.email);

  console.log("Condition Check:", type === "Customer", supplier.length > 0);

  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const { data: templateResponse, isLoading: templatesLoading, error: templatesError } = useGetAllTemplatesQuery();
  const templates = templateResponse?.data || [];
  const recipientEmail = type === "Customer" && Array.isArray(supplier) && supplier[0]?.email
  ? supplier[0].email
  : email;
  console.log("Recipient Email:", recipientEmail);
  
  useEffect(() => {
    console.log("Supplier updated:", supplier);
  }, [supplier]);
  
  const handleSendEmail = async () => {
    try {
      setIsLoading(true); 
      
      const emailData = {
        subject: subject,
        message: message,
        recipients: Array.isArray(recipientEmail) ? recipientEmail : [recipientEmail],
        chemicalNames: Array.isArray(chemicalName) ? chemicalName : [chemicalName]
      };

      const response = await fetch('/api/chemicalMail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send email');
      }

      alert('Email sent successfully!');
      setMessage('');
      setSubject('');
      
    } catch (error) {
      console.log('Error sending email:', error);
      alert('Failed to send email: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateChange = (templateId) => {
    const template = templates.find((t) => t._id === templateId);
    setSelectedTemplate(template);
    setMessage(template?.body || '');
    setSubject(template?.subject || '');
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">
            <Mail className="w-4 h-4 mr-2" />
            Send Email ({selectedSupplier.length})
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Send Email to Selected Suppliers</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 ">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="mb-2 text-sm font-medium">Selected Suppliers</h3>
                <div className="p-2 border rounded-lg max-h-[100px] overflow-y-auto">
                  {recipientEmail}
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-medium">Selected Chemicals</h3>
                <div className="p-2 border rounded-lg max-h-[100px] overflow-y-auto">
                  <div className="text-sm py-1">{chemicalName}</div>
                </div>
              </div>
            </div>
            <Select onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select email template" />
              </SelectTrigger>
              <SelectContent>
                {templatesLoading ? (
                  <SelectItem value="" disabled>Loading...</SelectItem>
                ) : templatesError ? (
                  <SelectItem value="" disabled>Error loading templates</SelectItem>
                ) : (
                  templates.map((template) => (
                    <SelectItem key={template._id} value={template._id}>
                      {template.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <Input 
              placeholder="Subject" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <div className="max-h-[300px] overflow-y-auto">
              <ReactQuill
                value={message}
                onChange={setMessage}
                placeholder="Write your message here..."
                theme="snow"
                className="bg-white rounded-lg"
              />
            </div>
            <Button
              className="bg-[#3b1f91] hover:bg-purple-700"
              onClick={handleSendEmail}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Email'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailForm;

