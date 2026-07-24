import * as React from 'react';

interface ContactFormEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
  jobTitle?: string;
  resumeFileName?: string;
  customFields?: Record<string, string>;
}

export const ContactFormEmail: React.FC<ContactFormEmailProps> = ({
  name,
  email,
  subject,
  message,
  jobTitle,
  resumeFileName,
  customFields,
}) => {
  return (
    <div style={{
      backgroundColor: '#080b11',
      color: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      padding: '30px 20px',
      margin: '0 auto',
      maxWidth: '600px',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      {/* Header Banner */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        paddingBottom: '20px',
        marginBottom: '25px',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '22px',
          fontWeight: '800',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          margin: '0',
          color: '#ffffff'
        }}>
          DASI <span style={{ color: '#8b5cf6' }}>GAMES</span>
        </h2>
        <p style={{
          fontSize: '12px',
          color: '#94a3b8',
          margin: '6px 0 0 0',
          letterSpacing: '0.1em',
          textTransform: 'uppercase'
        }}>
          Inbound Website Inquiry Notification
        </p>
      </div>

      {/* Inquiry Summary Table */}
      <div style={{
        backgroundColor: '#0f131a',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '25px',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px 0', color: '#94a3b8', width: '110px', fontWeight: '600' }}>From:</td>
              <td style={{ padding: '8px 0', color: '#ffffff', fontWeight: '700' }}>{name} ({email})</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#94a3b8', fontWeight: '600' }}>Subject:</td>
              <td style={{ padding: '8px 0', color: '#8b5cf6', fontWeight: '700' }}>{subject}</td>
            </tr>
            {jobTitle && (
              <tr>
                <td style={{ padding: '8px 0', color: '#94a3b8', fontWeight: '600' }}>Job Position:</td>
                <td style={{ padding: '8px 0', color: '#38bdf8', fontWeight: '700' }}>{jobTitle}</td>
              </tr>
            )}
            {resumeFileName && (
              <tr>
                <td style={{ padding: '8px 0', color: '#94a3b8', fontWeight: '600' }}>Attachment:</td>
                <td style={{ padding: '8px 0', color: '#34d399', fontWeight: '600' }}>{resumeFileName}</td>
              </tr>
            )}
            {customFields && Object.entries(customFields).map(([key, val]) => (
              <tr key={key}>
                <td style={{ padding: '8px 0', color: '#94a3b8', fontWeight: '600' }}>{key}:</td>
                <td style={{ padding: '8px 0', color: '#e2e8f0' }}>{val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Inquiry Message Body */}
      <div style={{
        backgroundColor: '#0f131a',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid rgba(255,255,255,0.05)',
        marginBottom: '25px'
      }}>
        <h4 style={{
          fontSize: '11px',
          fontWeight: '700',
          color: '#94a3b8',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          margin: '0 0 12px 0'
        }}>
          Message Content
        </h4>
        <p style={{
          fontSize: '14px',
          lineHeight: '1.6',
          color: '#e2e8f0',
          margin: '0',
          whiteSpace: 'pre-wrap'
        }}>
          {message}
        </p>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        fontSize: '11px',
        color: '#64748b',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        paddingTop: '16px'
      }}>
        This email was dispatched automatically via dasigames.com API.
      </div>
    </div>
  );
};

export default ContactFormEmail;
