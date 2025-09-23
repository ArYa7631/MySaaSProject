class Api::V1::ContactsController < Api::V1::BaseController
  # Skip authentication for public contact form submission
  skip_before_action :authenticate_user_from_jwt!, only: [:create]
  
  before_action :require_community, except: [:create]
  before_action :require_community_access, except: [:create]
  before_action :set_contact, only: [:show, :destroy]

  # GET /api/v1/communities/:community_id/contacts
  def index
    contacts = current_community.contacts.order(:created_at)
    contacts = contacts.by_email(params[:email]) if params[:email]
    contacts = contacts.recent if params[:recent] == 'true'
    contacts = paginate(contacts) if params[:page]
    
    render_success(contacts, ContactSerializer)
  end

  # GET /api/v1/communities/:community_id/contacts/:id
  def show
    render_success(@contact, ContactSerializer)
  end

  # POST /api/v1/communities/:community_id/contacts
  def create
    # For public contact form, we need to find the community from the URL params
    community = Community.find(params[:community_id])
    @contact = community.contacts.build(contact_params)
    
    if @contact.save
      render_created(@contact, ContactSerializer)
    else
      render_error("Failed to submit contact form", @contact.errors.as_json)
    end
  end

  # DELETE /api/v1/communities/:community_id/contacts/:id
  def destroy
    if @contact.destroy
      render json: { status: "success", message: "Contact deleted successfully" }, status: :ok
    else
      render_error("Failed to delete contact", @contact.errors.as_json)
    end
  end

  private

  def set_contact
    @contact = current_community.contacts.find(params[:id])
  end

  def contact_params
    params.require(:contact).permit(:name, :email, :contact_number, :message)
  end
end
