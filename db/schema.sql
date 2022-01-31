SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: block_access_level; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.block_access_level AS ENUM (
    'READ_ONLY',
    'READ_COMMENT',
    'READ_WRITE',
    'ADMIN'
);


--
-- Name: children_list; Type: DOMAIN; Schema: public; Owner: -
--

CREATE DOMAIN public.children_list AS text;


--
-- Name: member_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.member_type AS ENUM (
    'BOT',
    'GUEST',
    'MEMBER',
    'ADMIN'
);


--
-- Name: trigger_set_modified_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.trigger_set_modified_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.modified_at = NOW();
  RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: blocks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blocks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type text NOT NULL,
    rank text DEFAULT '0'::text NOT NULL,
    content text NOT NULL,
    format text NOT NULL,
    parent_block_id uuid,
    parent_page_id uuid,
    space_id uuid NOT NULL,
    created_by uuid NOT NULL,
    modified_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    modified_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    parent_pages_ids uuid[] DEFAULT '{}'::uuid[] NOT NULL
);


--
-- Name: instance_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.instance_settings (
    setting_key text NOT NULL,
    setting_value text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    modified_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying(255) NOT NULL
);


--
-- Name: space_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.space_members (
    user_id uuid NOT NULL,
    space_id uuid NOT NULL,
    type public.member_type NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    modified_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: space_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.space_permissions (
    space_id uuid NOT NULL,
    block_id uuid NOT NULL,
    access_level public.block_access_level NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    modified_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: spaces; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.spaces (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    handle text NOT NULL,
    name text NOT NULL,
    icon text NOT NULL,
    settings text NOT NULL,
    domains text[] NOT NULL,
    invitation_token text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    modified_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: user_group_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_group_members (
    user_id uuid NOT NULL,
    user_group_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    modified_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: user_group_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_group_permissions (
    user_group_id uuid NOT NULL,
    block_id uuid NOT NULL,
    access_level public.block_access_level NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    modified_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: user_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_groups (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    icon text NOT NULL,
    space_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    modified_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: user_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_permissions (
    user_id uuid NOT NULL,
    block_id uuid NOT NULL,
    access_level public.block_access_level NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    modified_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    avatar text NOT NULL,
    settings text NOT NULL,
    confirmation_token text,
    confirmation_sent_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    modified_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: blocks blocks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blocks
    ADD CONSTRAINT blocks_pkey PRIMARY KEY (id);


--
-- Name: instance_settings instance_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.instance_settings
    ADD CONSTRAINT instance_settings_pkey PRIMARY KEY (setting_key);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: space_members space_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.space_members
    ADD CONSTRAINT space_members_pkey PRIMARY KEY (user_id, space_id);


--
-- Name: space_permissions space_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.space_permissions
    ADD CONSTRAINT space_permissions_pkey PRIMARY KEY (space_id, block_id);


--
-- Name: spaces spaces_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.spaces
    ADD CONSTRAINT spaces_pkey PRIMARY KEY (id);


--
-- Name: user_group_members user_group_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_group_members
    ADD CONSTRAINT user_group_members_pkey PRIMARY KEY (user_id, user_group_id);


--
-- Name: user_group_permissions user_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_group_permissions
    ADD CONSTRAINT user_group_permissions_pkey PRIMARY KEY (user_group_id, block_id);


--
-- Name: user_groups user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_groups
    ADD CONSTRAINT user_groups_pkey PRIMARY KEY (id);


--
-- Name: user_permissions user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_pkey PRIMARY KEY (user_id, block_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: blocks set_modified_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_modified_at BEFORE UPDATE ON public.blocks FOR EACH ROW EXECUTE FUNCTION public.trigger_set_modified_at();


--
-- Name: space_members set_modified_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_modified_at BEFORE UPDATE ON public.space_members FOR EACH ROW EXECUTE FUNCTION public.trigger_set_modified_at();


--
-- Name: space_permissions set_modified_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_modified_at BEFORE UPDATE ON public.space_permissions FOR EACH ROW EXECUTE FUNCTION public.trigger_set_modified_at();


--
-- Name: spaces set_modified_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_modified_at BEFORE UPDATE ON public.spaces FOR EACH ROW EXECUTE FUNCTION public.trigger_set_modified_at();


--
-- Name: user_group_members set_modified_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_modified_at BEFORE UPDATE ON public.user_group_members FOR EACH ROW EXECUTE FUNCTION public.trigger_set_modified_at();


--
-- Name: user_group_permissions set_modified_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_modified_at BEFORE UPDATE ON public.user_group_permissions FOR EACH ROW EXECUTE FUNCTION public.trigger_set_modified_at();


--
-- Name: user_groups set_modified_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_modified_at BEFORE UPDATE ON public.user_groups FOR EACH ROW EXECUTE FUNCTION public.trigger_set_modified_at();


--
-- Name: user_permissions set_modified_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_modified_at BEFORE UPDATE ON public.user_permissions FOR EACH ROW EXECUTE FUNCTION public.trigger_set_modified_at();


--
-- Name: users set_modified_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_modified_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.trigger_set_modified_at();


--
-- Name: blocks blocks_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blocks
    ADD CONSTRAINT blocks_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: blocks blocks_modified_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blocks
    ADD CONSTRAINT blocks_modified_by_fkey FOREIGN KEY (modified_by) REFERENCES public.users(id);


--
-- Name: blocks blocks_parent_block_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blocks
    ADD CONSTRAINT blocks_parent_block_id_fkey FOREIGN KEY (parent_block_id) REFERENCES public.blocks(id);


--
-- Name: blocks blocks_parent_page_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blocks
    ADD CONSTRAINT blocks_parent_page_id_fkey FOREIGN KEY (parent_page_id) REFERENCES public.blocks(id);


--
-- Name: blocks blocks_space_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blocks
    ADD CONSTRAINT blocks_space_id_fkey FOREIGN KEY (space_id) REFERENCES public.spaces(id);


--
-- Name: space_members space_members_space_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.space_members
    ADD CONSTRAINT space_members_space_id_fkey FOREIGN KEY (space_id) REFERENCES public.spaces(id);


--
-- Name: space_members space_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.space_members
    ADD CONSTRAINT space_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: space_permissions space_permissions_block_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.space_permissions
    ADD CONSTRAINT space_permissions_block_id_fkey FOREIGN KEY (block_id) REFERENCES public.blocks(id);


--
-- Name: space_permissions space_permissions_space_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.space_permissions
    ADD CONSTRAINT space_permissions_space_id_fkey FOREIGN KEY (space_id) REFERENCES public.spaces(id);


--
-- Name: user_group_members user_group_members_user_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_group_members
    ADD CONSTRAINT user_group_members_user_group_id_fkey FOREIGN KEY (user_group_id) REFERENCES public.user_groups(id);


--
-- Name: user_group_members user_group_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_group_members
    ADD CONSTRAINT user_group_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_group_permissions user_group_permissions_block_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_group_permissions
    ADD CONSTRAINT user_group_permissions_block_id_fkey FOREIGN KEY (block_id) REFERENCES public.blocks(id);


--
-- Name: user_group_permissions user_group_permissions_user_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_group_permissions
    ADD CONSTRAINT user_group_permissions_user_group_id_fkey FOREIGN KEY (user_group_id) REFERENCES public.user_groups(id);


--
-- Name: user_groups user_groups_space_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_groups
    ADD CONSTRAINT user_groups_space_id_fkey FOREIGN KEY (space_id) REFERENCES public.spaces(id);


--
-- Name: user_permissions user_permissions_block_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_block_id_fkey FOREIGN KEY (block_id) REFERENCES public.blocks(id);


--
-- Name: user_permissions user_permissions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20211228170936'),
    ('20211228171028'),
    ('20211228175731'),
    ('20211228182013'),
    ('20211228235047'),
    ('20211229095356'),
    ('20211229095859'),
    ('20211231194719'),
    ('20220127132505'),
    ('20220127160503'),
    ('20220130162836');
