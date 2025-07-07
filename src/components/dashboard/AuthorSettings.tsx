import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Shield, 
  Bell,
  Save,
  Eye,
  EyeOff,
  Check,
  X
} from 'lucide-react';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

const AuthorSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  
  // Phone verification states
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    bio: '',
    website: '',
    // Billing information
    billing_name: '',
    billing_address: '',
    billing_city: '',
    billing_state: '',
    billing_zip: '',
    billing_country: '',
    // Preferences
    email_notifications: true,
    review_notifications: true,
    marketing_emails: false
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData(prev => ({
          ...prev,
          full_name: data.full_name || '',
          email: data.email || user?.email || '',
          phone: data.phone || ''
        }));
      } else {
        // Create profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            user_id: user?.id,
            email: user?.email,
            full_name: user?.user_metadata?.full_name || ''
          }])
          .select()
          .single();

        if (createError) throw createError;
        setProfile(newProfile);
        setFormData(prev => ({
          ...prev,
          full_name: newProfile.full_name || '',
          email: newProfile.email || '',
          phone: newProfile.phone || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile information"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert([{
          user_id: user?.id,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Settings saved successfully!"
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const maskEmail = (email: string) => {
    if (!email) return '';
    const [local, domain] = email.split('@');
    const maskedLocal = local.substring(0, 2) + '*'.repeat(Math.max(1, local.length - 2));
    return `${maskedLocal}@${domain}`;
  };

  const sendOTP = async () => {
    if (!formData.phone) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid phone number"
      });
      return;
    }

    setSendingOtp(true);
    try {
      // Simulate OTP sending (in real app, use SMS service like Twilio)
      await new Promise(resolve => setTimeout(resolve, 2000));
      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${formData.phone}`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send OTP. Please try again."
      });
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid 6-digit OTP"
      });
      return;
    }

    setVerifyingPhone(true);
    try {
      // Simulate OTP verification (in real app, verify with SMS service)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo, accept any 6-digit code
      if (otpCode.length === 6) {
        setPhoneVerified(true);
        setOtpSent(false);
        setOtpCode('');
        toast({
          title: "Phone Verified",
          description: "Your phone number has been successfully verified!"
        });
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid OTP. Please try again."
      });
    } finally {
      setVerifyingPhone(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Update your personal details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Input
                  id="email"
                  type={showEmail ? "text" : "password"}
                  value={showEmail ? formData.email : maskEmail(formData.email)}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  disabled={!showEmail}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowEmail(!showEmail)}
                >
                  {showEmail ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Country Code"
                  value={formData.phone.startsWith('+') ? formData.phone.split(' ')[0] : '+1'}
                  onChange={(e) => {
                    const countryCode = e.target.value.startsWith('+') ? e.target.value : '+' + e.target.value.replace(/[^\d]/g, '');
                    const phoneNumber = formData.phone.includes(' ') ? formData.phone.split(' ').slice(1).join('') : formData.phone.replace(/^\+\d+/, '');
                    handleInputChange('phone', countryCode + (phoneNumber ? ' ' + phoneNumber : ''));
                  }}
                  className="w-28"
                />
                <Input
                  id="phone"
                  value={formData.phone.includes(' ') ? formData.phone.split(' ').slice(1).join('') : formData.phone.replace(/^\+\d+/, '')}
                  onChange={(e) => {
                    const phoneNumber = e.target.value.replace(/[^\d]/g, '');
                    const countryCode = formData.phone.startsWith('+') ? formData.phone.split(' ')[0] : '+1';
                    handleInputChange('phone', countryCode + (phoneNumber ? ' ' + phoneNumber : ''));
                  }}
                  placeholder="Enter your phone number"
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter country code (e.g., +1 for US, +91 for India) and phone number
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Author Bio (Optional)</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell readers about yourself..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Billing Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Billing Information
          </CardTitle>
          <CardDescription>
            Manage your billing details for review plans and services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billing_name">Billing Name</Label>
              <Input
                id="billing_name"
                value={formData.billing_name}
                onChange={(e) => handleInputChange('billing_name', e.target.value)}
                placeholder="Name on card/invoice"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billing_country">Country</Label>
              <Input
                id="billing_country"
                value={formData.billing_country}
                onChange={(e) => handleInputChange('billing_country', e.target.value)}
                placeholder="Country"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="billing_address">Address</Label>
            <Input
              id="billing_address"
              value={formData.billing_address}
              onChange={(e) => handleInputChange('billing_address', e.target.value)}
              placeholder="Street address"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billing_city">City</Label>
              <Input
                id="billing_city"
                value={formData.billing_city}
                onChange={(e) => handleInputChange('billing_city', e.target.value)}
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billing_state">State/Province</Label>
              <Input
                id="billing_state"
                value={formData.billing_state}
                onChange={(e) => handleInputChange('billing_state', e.target.value)}
                placeholder="State"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billing_zip">ZIP/Postal Code</Label>
              <Input
                id="billing_zip"
                value={formData.billing_zip}
                onChange={(e) => handleInputChange('billing_zip', e.target.value)}
                placeholder="ZIP Code"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Account Security
          </CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Email Verification</p>
                <p className="text-sm text-muted-foreground">
                  {user?.email_confirmed_at ? 'Email verified' : 'Email not verified'}
                </p>
              </div>
            </div>
            <Badge variant={user?.email_confirmed_at ? "default" : "secondary"}>
              {user?.email_confirmed_at ? 'Verified' : 'Unverified'}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Account Created</p>
                <p className="text-sm text-muted-foreground">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phone Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Phone Verification
          </CardTitle>
          <CardDescription>
            Verify your phone number for enhanced account security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Phone Number Verification</p>
                <p className="text-sm text-muted-foreground">
                  {phoneVerified ? 
                    `Phone number ${formData.phone} is verified` : 
                    formData.phone ? 
                      `${formData.phone} - Not verified` : 
                      'No phone number added'}
                </p>
              </div>
            </div>
            <Badge variant={phoneVerified ? "default" : "secondary"}>
              {phoneVerified ? (
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Verified
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <X className="w-3 h-3" />
                  Unverified
                </div>
              )}
            </Badge>
          </div>
          
          {formData.phone && !phoneVerified && (
            <div className="space-y-4 p-4 border rounded-lg bg-card">
              {!otpSent ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Send Verification Code</p>
                    <p className="text-sm text-muted-foreground">
                      We'll send a 6-digit code to {formData.phone}
                    </p>
                  </div>
                  <Button 
                    onClick={sendOTP} 
                    disabled={sendingOtp}
                    size="sm"
                  >
                    {sendingOtp ? 'Sending...' : 'Send OTP'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">Enter Verification Code</p>
                    <p className="text-sm text-muted-foreground">
                      Enter the 6-digit code sent to {formData.phone}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter 6-digit OTP"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      className="flex-1"
                    />
                    <Button 
                      onClick={verifyOTP} 
                      disabled={verifyingPhone || otpCode.length !== 6}
                      size="sm"
                    >
                      {verifyingPhone ? 'Verifying...' : 'Verify'}
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={sendOTP}
                    disabled={sendingOtp}
                  >
                    {sendingOtp ? 'Resending...' : 'Resend Code'}
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {!formData.phone && (
            <div className="p-4 border rounded-lg bg-muted/20">
              <p className="text-sm text-muted-foreground">
                Add a phone number in the Personal Information section to enable phone verification.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose what notifications you'd like to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive notifications about your account activity
              </p>
            </div>
            <Button
              variant={formData.email_notifications ? "default" : "outline"}
              size="sm"
              onClick={() => handleInputChange('email_notifications', !formData.email_notifications)}
            >
              {formData.email_notifications ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Review Notifications</p>
              <p className="text-sm text-muted-foreground">
                Get notified when your books receive new reviews
              </p>
            </div>
            <Button
              variant={formData.review_notifications ? "default" : "outline"}
              size="sm"
              onClick={() => handleInputChange('review_notifications', !formData.review_notifications)}
            >
              {formData.review_notifications ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Marketing Emails</p>
              <p className="text-sm text-muted-foreground">
                Receive updates about new features and promotions
              </p>
            </div>
            <Button
              variant={formData.marketing_emails ? "default" : "outline"}
              size="sm"
              onClick={() => handleInputChange('marketing_emails', !formData.marketing_emails)}
            >
              {formData.marketing_emails ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};

export default AuthorSettings;